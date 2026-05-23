import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// スタッフ一覧取得（送信先選択用）
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, login_id, name, department_id, departments(name)')
      .eq('is_active', true)
      .neq('id', session.userId) // 自分を除外
      .order('name');

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Users GET error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
