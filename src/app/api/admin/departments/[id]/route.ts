import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: '未認証' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

  // この部署に所属するスタッフ数を確認
  const { count } = await supabaseAdmin
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('department_id', params.id)
    .eq('is_active', true);

  if (count && count > 0) {
    return NextResponse.json({ error: `この部署には${count}人のスタッフが所属しています。先にスタッフの部署を変更してください。` }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('departments')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  return NextResponse.json({ data: { success: true } });
}
