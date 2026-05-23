import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// 管理者：月別ランキング取得
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || new Date().toISOString().substring(0, 7);
  const [year, mon] = month.split('-').map(Number);

  try {
    // 送信ランキング
    const { data: sendRanking, error: sendError } = await supabaseAdmin
      .rpc('get_monthly_ranking', {
        target_year: year,
        target_month: mon,
        rank_type: 'send',
      });

    // 受信ランキング
    const { data: receiveRanking, error: receiveError } = await supabaseAdmin
      .rpc('get_monthly_ranking', {
        target_year: year,
        target_month: mon,
        rank_type: 'receive',
      });

    if (sendError) throw sendError;
    if (receiveError) throw receiveError;

    return NextResponse.json({
      data: {
        month,
        send_ranking: sendRanking || [],
        receive_ranking: receiveRanking || [],
      },
    });
  } catch (err) {
    console.error('Ranking error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
