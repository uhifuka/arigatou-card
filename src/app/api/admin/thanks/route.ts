import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// 管理者：全ありがとう履歴取得（フィルタ付き）
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');       // YYYY-MM
  const sender_id = searchParams.get('sender_id');
  const receiver_id = searchParams.get('receiver_id');
  const search = searchParams.get('search');

  try {
    let query = supabaseAdmin
      .from('thanks_with_names')
      .select('*')
      .order('sent_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (month) {
      const start = `${month}-01`;
      // 月末計算: 翌月の1日の前日
      const [year, mon] = month.split('-').map(Number);
      const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, '0')}`;
      const end = `${nextMonth}-01`;
      query = query.gte('sent_date', start).lt('sent_date', end);
    }

    if (sender_id) {
      query = query.eq('sender_id', sender_id);
    }

    if (receiver_id) {
      query = query.eq('receiver_id', receiver_id);
    }

    if (search) {
      query = query.or(
        `sender_name.ilike.%${search}%,receiver_name.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Admin thanks GET error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
