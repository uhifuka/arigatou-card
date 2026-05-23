import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// 月別ありがとう件数取得（全スタッフ閲覧可）
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  try {
    const { data, error } = await supabaseAdmin
      .from('thanks_messages')
      .select('sent_date')
      .gte('sent_date', `${year}-01-01`)
      .lte('sent_date', `${year}-12-31`);

    if (error) throw error;

    // 月ごとに集計 (key: "01"〜"12")
    const monthly: Record<string, number> = {};
    for (let m = 1; m <= 12; m++) {
      monthly[String(m).padStart(2, '0')] = 0;
    }
    data?.forEach(({ sent_date }) => {
      const mm = sent_date.substring(5, 7);
      monthly[mm] = (monthly[mm] || 0) + 1;
    });

    return NextResponse.json({ data: monthly });
  } catch (err) {
    console.error('Tree GET error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
