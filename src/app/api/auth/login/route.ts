import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { createToken, getSessionCookieOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { login_id, password } = await req.json();

    if (!login_id || !password) {
      return NextResponse.json({ error: 'IDとパスワードを入力してください' }, { status: 400 });
    }

    // ユーザー検索
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, login_id, name, role, password_hash, is_active')
      .eq('login_id', login_id.trim())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'IDまたはパスワードが正しくありません' }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'このアカウントは無効です。管理者にお問い合わせください' }, { status: 403 });
    }

    // パスワード検証
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'IDまたはパスワードが正しくありません' }, { status: 401 });
    }

    // JWTセッション生成
    const session = {
      userId: user.id,
      loginId: user.login_id,
      name: user.name,
      role: user.role,
    };
    const token = await createToken(session);

    const response = NextResponse.json({
      data: { role: user.role, name: user.name },
    });

    response.cookies.set(getSessionCookieOptions(token));
    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
