import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// 管理者：スタッフ一覧取得
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from('user_stats')
    .select('*')
    .order('name');

  if (error) return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  return NextResponse.json({ data });
}

// 管理者：スタッフ追加
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  try {
    const { login_id, name, password, role, department_id } = await req.json();

    if (!login_id || !name || !password) {
      return NextResponse.json({ error: 'ID・氏名・パスワードは必須です' }, { status: 400 });
    }

    // 重複チェック
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('login_id', login_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'このIDは既に使用されています' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ login_id, name, password_hash, role: role || 'staff', department_id: department_id || null })
      .select('id, login_id, name, role')
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('User POST error:', err);
    return NextResponse.json({ error: 'スタッフの追加に失敗しました' }, { status: 500 });
  }
}
