import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionFromRequest } from '@/lib/auth';
import { getTodayString } from '@/lib/utils';

// ありがとうメッセージ一覧取得（自分の送受信）
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all'; // 'sent' | 'received' | 'all'

  try {
    let query = supabaseAdmin
      .from('thanks_with_names')
      .select('*')
      .order('sent_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (type === 'sent') {
      query = query.eq('sender_id', session.userId);
    } else if (type === 'received') {
      query = query.eq('receiver_id', session.userId);
    } else {
      // 自分の送受信すべて
      query = query.or(`sender_id.eq.${session.userId},receiver_id.eq.${session.userId}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Thanks GET error:', err);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}

// ありがとうメッセージ送信
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: '未認証' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { receiver_id, message, sent_date } = body;

    // バリデーション
    if (!receiver_id) {
      return NextResponse.json({ error: '送り先を選択してください' }, { status: 400 });
    }
    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'メッセージを入力してください' }, { status: 400 });
    }
    if (receiver_id === session.userId) {
      return NextResponse.json({ error: '自分自身には送れません' }, { status: 400 });
    }

    // 受信者の存在確認
    const { data: receiver } = await supabaseAdmin
      .from('users')
      .select('id, name, is_active')
      .eq('id', receiver_id)
      .single();

    if (!receiver || !receiver.is_active) {
      return NextResponse.json({ error: '送り先のスタッフが見つかりません' }, { status: 404 });
    }

    // 保存
    const { data, error } = await supabaseAdmin
      .from('thanks_messages')
      .insert({
        sender_id: session.userId,
        receiver_id,
        message: message.trim(),
        sent_date: sent_date || getTodayString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Thanks POST error:', err);
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 });
  }
}
