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
    // ユーザー別統計（先に取得）
    const { data: userStats, error: userError } = await supabaseAdmin
      .from('user_stats')
      .select('*')
      .order('send_count', { ascending: false });

    if (userError) throw userError;

    // 月別集計（全件取得してJSでフィルタ）
    const { data: monthlyRaw, error: monthlyError } = await supabaseAdmin
      .from('thanks_messages')
      .select('sent_date');

    if (monthlyError) throw monthlyError;

    // 過去12ヶ月のセット
    const now = new Date();
    const past12Months = new Set(
      Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      })
    );

    const monthlyMap: Record<string, number> = {};
    monthlyRaw?.forEach(({ sent_date }) => {
      if (!sent_date) return;
      const month = String(sent_date).substring(0, 7); // YYYY-MM
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    const monthlyStats = Object.entries(monthlyMap)
      .filter(([month]) => past12Months.has(month))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, total_count: count }));

    // 全体の合計はuser_statsのsend_countの総計
    const totalCount = (userStats || []).reduce((s, u) => s + (u.send_count || 0), 0);

    return NextResponse.json({
      data: {
        monthly_stats: monthlyStats,
        user_stats: userStats,
        total_count: totalCount,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
