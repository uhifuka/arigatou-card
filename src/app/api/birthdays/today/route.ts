import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });

  const now = new Date();
  const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name')
    .eq('birthday', mmdd)
    .eq('is_active', true);

  if (error) return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}
