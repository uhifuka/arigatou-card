import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: '入力内容が不正です' }, { status: 400 });
  }
  if (newPassword.length < 4) {
    return NextResponse.json({ error: 'パスワードは4文字以上で入力してください' }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('password_hash')
    .eq('id', session.userId)
    .single();

  if (!user) return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 400 });

  const password_hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabaseAdmin
    .from('users')
    .update({ password_hash })
    .eq('id', session.userId);

  if (error) return NextResponse.json({ error: 'パスワードの変更に失敗しました' }, { status: 500 });
  return NextResponse.json({ data: { success: true } });
}
