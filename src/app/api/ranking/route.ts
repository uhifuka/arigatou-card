import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month') || new Date().toISOString().substring(0, 7);
  const [year, mon] = month.split('-').map(Number);

  try {
    const [{ data: sendRanking, error: sendError }, { data: receiveRanking, error: receiveError }] =
      await Promise.all([
        supabaseAdmin.rpc('get_monthly_ranking', { target_year: year, target_month: mon, rank_type: 'send' }),
        supabaseAdmin.rpc('get_monthly_ranking', { target_year: year, target_month: mon, rank_type: 'receive' }),
      ]);

    if (sendError) throw sendError;
    if (receiveError) throw receiveError;

    return NextResponse.json({
      data: {
        month,
        send_ranking: (sendRanking || []).slice(0, 5),
        receive_ranking: (receiveRanking || []).slice(0, 5),
      },
    });
  } catch (err) {
    console.error('Ranking error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
