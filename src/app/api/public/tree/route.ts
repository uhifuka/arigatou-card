import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 認証不要：今月のありがとう件数を返す（集計のみ、個人情報なし）
export async function GET() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const pad = (n: number) => String(n).padStart(2, '0');
  const start = `${year}-${pad(month)}-01`;
  const end = `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`;

  try {
    const { count } = await supabaseAdmin
      .from('thanks_messages')
      .select('*', { count: 'exact', head: true })
      .gte('sent_date', start)
      .lte('sent_date', end);

    return NextResponse.json({ data: { count: count || 0, month, year } });
  } catch {
    return NextResponse.json({ data: { count: 0, month, year } });
  }
}
