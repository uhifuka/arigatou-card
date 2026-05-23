import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

// スタッフ更新
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  try {
    const { name, role, department_id, is_active, password, birthday } = await req.json();

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (department_id !== undefined) updates.department_id = department_id || null;
    if (is_active !== undefined) updates.is_active = is_active;
    if (birthday !== undefined) updates.birthday = birthday || null;
    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select('id, login_id, name, role, is_active')
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    console.error('User PUT error:', err);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }
}

// スタッフ削除（論理削除）
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  // 自分自身は削除不可
  if (params.id === session.userId) {
    return NextResponse.json({ error: '自分自身は削除できません' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ is_active: false })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  return NextResponse.json({ data: { success: true } });
}
