import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 初期データセットアップ用エンドポイント（使用後に削除すること）
export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  if (secret !== 'SETUP_ARIGATOU_2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 既存データを削除
    await supabaseAdmin.from('thanks_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 部署
    const { error: deptErr } = await supabaseAdmin.from('departments').insert([
      { id: '11111111-1111-1111-1111-111111111111', name: '診療' },
      { id: '22222222-2222-2222-2222-222222222222', name: '看護' },
      { id: '33333333-3333-3333-3333-333333333333', name: '受付・医療クラーク' },
      { id: '44444444-4444-4444-4444-444444444444', name: '広報・事務' },
    ]);
    if (deptErr) throw new Error('departments: ' + deptErr.message);

    // ユーザー（bcryptハッシュ済み）
    const { error: userErr } = await supabaseAdmin.from('users').insert([
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        login_id: 'admin', name: '管理者',
        password_hash: '$2b$10$6xslVhJbg/icva9J2E1Zju3tVF6i15cekZbTkr5jdSUKVdLtRR7Re',
        role: 'admin', department_id: null,
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
        login_id: 'ueda001', name: '上田 花子',
        password_hash: '$2b$10$lLivSeateFnOQ5g4vi4nOuCHmxit2RAST9D8EgbwvmQbdwDGIqECm',
        role: 'staff', department_id: '22222222-2222-2222-2222-222222222222',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02',
        login_id: 'ueda002', name: '山田 太郎',
        password_hash: '$2b$10$lLivSeateFnOQ5g4vi4nOuCHmxit2RAST9D8EgbwvmQbdwDGIqECm',
        role: 'staff', department_id: '33333333-3333-3333-3333-333333333333',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03',
        login_id: 'ueda003', name: '佐藤 美咲',
        password_hash: '$2b$10$lLivSeateFnOQ5g4vi4nOuCHmxit2RAST9D8EgbwvmQbdwDGIqECm',
        role: 'staff', department_id: '22222222-2222-2222-2222-222222222222',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04',
        login_id: 'ueda004', name: '田中 春奈',
        password_hash: '$2b$10$lLivSeateFnOQ5g4vi4nOuCHmxit2RAST9D8EgbwvmQbdwDGIqECm',
        role: 'staff', department_id: '33333333-3333-3333-3333-333333333333',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05',
        login_id: 'ueda005', name: '鈴木 恵',
        password_hash: '$2b$10$lLivSeateFnOQ5g4vi4nOuCHmxit2RAST9D8EgbwvmQbdwDGIqECm',
        role: 'staff', department_id: '44444444-4444-4444-4444-444444444444',
      },
    ]);
    if (userErr) throw new Error('users: ' + userErr.message);

    return NextResponse.json({ success: true, message: 'セットアップ完了' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
