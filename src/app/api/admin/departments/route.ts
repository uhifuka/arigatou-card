import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('departments')
    .select('id, name')
    .order('name');

  if (error) return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: '部署名を入力してください' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('departments')
    .insert({ name: name.trim() })
    .select('id, name')
    .single();

  if (error) return NextResponse.json({ error: '追加に失敗しました' }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
