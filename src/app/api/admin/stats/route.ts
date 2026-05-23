import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// 管理者：統計データ取得
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  try {
    // 月別集計（過去12ヶ月）
    const { data: monthlyRaw, error: monthlyError } = await supabaseAdmin
      .from('thanks_messages')
      .select('sent_date')
      .gte('sent_date', new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString().split('T')[0]);

    if (monthlyError) throw monthlyError;

    // JavaScriptで月別集計
    const monthlyMap: Record<string, number> = {};
    monthlyRaw?.forEach(({ sent_date }) => {
      const month = sent_date.substring(0, 7); // YYYY-MM
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    const monthlyStats = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, total_count: count }));

    // ユーザー別統計
    const { data: userStats, error: userError } = await supabaseAdmin
      .from('user_stats')
      .select('*')
      .order('send_count', { ascending: false });

    if (userError) throw userError;

    // 全体の合計
    const { count: totalCount } = await supabaseAdmin
      .from('thanks_messages')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      data: {
        monthly_stats: monthlyStats,
        user_stats: userStats,
        total_count: totalCount || 0,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
