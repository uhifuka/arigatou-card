import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// ⚠️ 一時的なセットアップ用API - 使用後に必ず削除
export async function POST() {
  const users = [
    { login_id: 'admin',  name: '管理者',        password_hash: '$2b$10$5Q5I4mdKG3X/WTZIIK1SwOumE5HHcuWAa8X5CbTWdB4N1K5H6.00q', role: 'admin'  },
    { login_id: 'ueda01', name: '上田 厚登',      password_hash: '$2b$10$eZzw7pNHzm/qs6ggtnhT9.K0/3t4q1RV2Cyo.v6q7F63fKkv4pyI6', role: 'staff' },
    { login_id: 'ueda02', name: '浅井 幸',        password_hash: '$2b$10$SGlq5GTc.AxzibOQbw/c6eU4Isszmab6rWGBrKJZpDBgfwnPEh2pm', role: 'staff' },
    { login_id: 'ueda03', name: '峰 隆明',        password_hash: '$2b$10$YKuWMOIM12ng67yJtVLxVOIRqa0w7cSoyCoCiRvwm0IGt6MhA48U6', role: 'staff' },
    { login_id: 'ueda04', name: '小村 好恵',      password_hash: '$2b$10$EMM2pUDz4GgQNyacmzY.ceXD4vZ.083ML4Hvd99DM3QpTIHYKUUsW', role: 'staff' },
    { login_id: 'ueda05', name: '北村 眞知子',    password_hash: '$2b$10$S/K1f0dRx9QX/lacKScTceonnFIIgvQsfxNZSR39wQurfYoBVFViG', role: 'staff' },
    { login_id: 'ueda06', name: '道脇 裕子',      password_hash: '$2b$10$metMYeOAqrid8hEgprzlPuy2zn9Bmr4IFhHVA3q4tPklcZrYFfoK2', role: 'staff' },
    { login_id: 'ueda07', name: '土井 奈緒美',    password_hash: '$2b$10$Q4oHapmKHozjWOOrYApkoOEEUTKsQ8a.VJh6Us8Qb3WkeCVt5VJey', role: 'staff' },
    { login_id: 'ueda09', name: '山下 沙織',      password_hash: '$2b$10$.bOY0lZicZU55Hs4HtyIaOSq5YXQDswJkt.zxjqy2ipBrI4pqeNH.', role: 'staff' },
    { login_id: 'ueda11', name: '神田 楓香',      password_hash: '$2b$10$4DndLtnK00M6ngAl6o9/teVyKvrgEEhH9CDxSbG3rmpQ3FF2JIJMO', role: 'staff' },
    { login_id: 'ueda12', name: '道上 たまき',    password_hash: '$2b$10$ywHVc8N4C935Z2Z4SkdhFuwPAj9LsN0ojAViBNAeA7uREWAq7l8mS', role: 'staff' },
    { login_id: 'ueda13', name: '諫見 美加',      password_hash: '$2b$10$9dI02l1tQfasI.lhFOrAQe6RKnbHgL2VHbWRxrcdGLi9JlRN0qWoS', role: 'staff' },
    { login_id: 'ueda14', name: '埋ノ江 美輝',    password_hash: '$2b$10$Hdj1Ly2vnGyCO7CqDZyGEOt2qN9ZubQ6WvBZVNW4iZguqUQaMpmCK', role: 'staff' },
    { login_id: 'ueda15', name: '古賀 結子',      password_hash: '$2b$10$FBdb7PU0qEt1tQAGyTmlle2FKNl1YC6j712ZqZBq8ilKDjFURGqo.', role: 'staff' },
    { login_id: 'ueda16', name: '浅山 茉由',      password_hash: '$2b$10$dlDG4scoE8vv.oWLcoZ74OgwOBT2GoyITmXcVFMEFp3NrOk/rWyD6', role: 'staff' },
    { login_id: 'ueda18', name: '相田 甫香',      password_hash: '$2b$10$dkH3SGN3GJzq5MCNAngR6.GSW5Cf.ZPe7FyFjNeA62Agsfo5C0V92', role: 'staff' },
    { login_id: 'ueda19', name: '中村 真帆',      password_hash: '$2b$10$2r9rN.s74KXy0axuS27Bpu63677dpxNSlalFfM7fW0Xf.qgcuTtqG', role: 'staff' },
    { login_id: 'ueda21', name: '小川 真奈',      password_hash: '$2b$10$O2BJHMh5iX1/sk0/o0kmpeYVz5IK0bKAMqbE4oiyN3nqat.5d/FWe', role: 'staff' },
    { login_id: 'ueda22', name: '近藤久春',       password_hash: '$2b$10$WJBThxMEYz3VoZDug82TDOOMfFJrcGFVEHHFfKa9w7jEij51lPc2C', role: 'staff' },
    { login_id: 'ueda23', name: '阪元 洋子',      password_hash: '$2b$10$K9/SpwQ3BDnx6IUpw5YLcOzrcPlzK3BM0/3woSaP.sicvPC7peHsC', role: 'staff' },
    { login_id: 'ueda24', name: '関本 紘子',      password_hash: '$2b$10$ZimiycYxSlIn9cGBeqFicO1UxH8PWEJLvv49pZ4ebKMGRCU4PGfWa', role: 'staff' },
    { login_id: 'ueda25', name: '溝上 千尋',      password_hash: '$2b$10$W5gOHitSxgMxSl.5o6uKeeDLvl0z0w/NVjQb0NnWsLa48V2Nk.XfS', role: 'staff' },
    { login_id: 'ueda26', name: '古藤 舞',        password_hash: '$2b$10$Qis44K2IoYMbiSifRGQodO1WYEVGle5LnwNbqQ1NWXIi9tDuY1lY.', role: 'staff' },
    { login_id: 'ueda29', name: '中峯 あずさ',    password_hash: '$2b$10$mg6/fbV40C6KF4T/N3U6TOTGdKgO12XEGEjpZA1Pwhw7t1FQPhY8i', role: 'staff' },
    { login_id: 'ueda30', name: '尾崎 知奈美',    password_hash: '$2b$10$qkrM735Q4XvGooQ2iw3il.BfV7nPWu5Zm710mvZH1dvZaJ2o3yU/2', role: 'staff' },
    { login_id: 'ueda32', name: '宮川 菜々子',    password_hash: '$2b$10$hk0qMsxv8JDzl2lLfZBrROWust.YefyFnVvwhVLMyvTTolhQwEg9W', role: 'staff' },
    { login_id: 'ueda33', name: '奥山 由貴子',    password_hash: '$2b$10$eZzw7pNHzm/qs6ggtnhT9.K0/3t4q1RV2Cyo.v6q7F63fKkv4pyI6', role: 'staff' },
    { login_id: 'ueda35', name: '本田 礼',        password_hash: '$2b$10$SGlq5GTc.AxzibOQbw/c6eU4Isszmab6rWGBrKJZpDBgfwnPEh2pm', role: 'staff' },
    { login_id: 'ueda37', name: '前田 妃呂',      password_hash: '$2b$10$YKuWMOIM12ng67yJtVLxVOIRqa0w7cSoyCoCiRvwm0IGt6MhA48U6', role: 'staff' },
    { login_id: 'ueda38', name: '山口 葉奈香',    password_hash: '$2b$10$EMM2pUDz4GgQNyacmzY.ceXD4vZ.083ML4Hvd99DM3QpTIHYKUUsW', role: 'staff' },
    { login_id: 'ueda39', name: '中嶋 麻衣子',    password_hash: '$2b$10$S/K1f0dRx9QX/lacKScTceonnFIIgvQsfxNZSR39wQurfYoBVFViG', role: 'staff' },
    { login_id: 'ueda40', name: '本田 由萌',      password_hash: '$2b$10$metMYeOAqrid8hEgprzlPuy2zn9Bmr4IFhHVA3q4tPklcZrYFfoK2', role: 'staff' },
    { login_id: 'ueda43', name: '竜田 夕花',      password_hash: '$2b$10$Q4oHapmKHozjWOOrYApkoOEEUTKsQ8a.VJh6Us8Qb3WkeCVt5VJey', role: 'staff' },
    { login_id: 'ueda45', name: '楠本 雪乃',      password_hash: '$2b$10$.bOY0lZicZU55Hs4HtyIaOSq5YXQDswJkt.zxjqy2ipBrI4pqeNH.', role: 'staff' },
    { login_id: 'ueda46', name: '田浦 愛麗',      password_hash: '$2b$10$4DndLtnK00M6ngAl6o9/teVyKvrgEEhH9CDxSbG3rmpQ3FF2JIJMO', role: 'staff' },
    { login_id: 'ueda47', name: '森岡 瑠',        password_hash: '$2b$10$ywHVc8N4C935Z2Z4SkdhFuwPAj9LsN0ojAViBNAeA7uREWAq7l8mS', role: 'staff' },
    { login_id: 'ueda48', name: '松永 愛美',      password_hash: '$2b$10$9dI02l1tQfasI.lhFOrAQe6RKnbHgL2VHbWRxrcdGLi9JlRN0qWoS', role: 'staff' },
    { login_id: 'ueda49', name: '古川 愛梨',      password_hash: '$2b$10$Hdj1Ly2vnGyCO7CqDZyGEOt2qN9ZubQ6WvBZVNW4iZguqUQaMpmCK', role: 'staff' },
    { login_id: 'ueda50', name: '澁川 葵生',      password_hash: '$2b$10$FBdb7PU0qEt1tQAGyTmlle2FKNl1YC6j712ZqZBq8ilKDjFURGqo.', role: 'staff' },
    { login_id: 'ueda51', name: '濱野 珠莉',      password_hash: '$2b$10$dlDG4scoE8vv.oWLcoZ74OgwOBT2GoyITmXcVFMEFp3NrOk/rWyD6', role: 'staff' },
    { login_id: 'ueda54', name: '小林 捺央',      password_hash: '$2b$10$dkH3SGN3GJzq5MCNAngR6.GSW5Cf.ZPe7FyFjNeA62Agsfo5C0V92', role: 'staff' },
    { login_id: 'ueda55', name: '立石 直子',      password_hash: '$2b$10$2r9rN.s74KXy0axuS27Bpu63677dpxNSlalFfM7fW0Xf.qgcuTtqG', role: 'staff' },
    { login_id: 'ueda59', name: '杉山 鮎子',      password_hash: '$2b$10$O2BJHMh5iX1/sk0/o0kmpeYVz5IK0bKAMqbE4oiyN3nqat.5d/FWe', role: 'staff' },
    { login_id: 'ueda60', name: '宮嵜 愛美',      password_hash: '$2b$10$WJBThxMEYz3VoZDug82TDOOMfFJrcGFVEHHFfKa9w7jEij51lPc2C', role: 'staff' },
    { login_id: 'ueda61', name: '田川 那美子',    password_hash: '$2b$10$K9/SpwQ3BDnx6IUpw5YLcOzrcPlzK3BM0/3woSaP.sicvPC7peHsC', role: 'staff' },
    { login_id: 'ueda62', name: '本村 梨星',      password_hash: '$2b$10$ZimiycYxSlIn9cGBeqFicO1UxH8PWEJLvv49pZ4ebKMGRCU4PGfWa', role: 'staff' },
    { login_id: 'ueda63', name: '山下 ひなた',    password_hash: '$2b$10$W5gOHitSxgMxSl.5o6uKeeDLvl0z0w/NVjQb0NnWsLa48V2Nk.XfS', role: 'staff' },
    { login_id: 'ueda64', name: '久留須 陽菜',    password_hash: '$2b$10$Qis44K2IoYMbiSifRGQodO1WYEVGle5LnwNbqQ1NWXIi9tDuY1lY.', role: 'staff' },
  ];

  try {
    // 全ユーザー削除（thanks_messagesはCASCADEで連鎖削除）
    await supabaseAdmin.from('thanks_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 新規挿入
    const { error } = await supabaseAdmin.from('users').insert(
      users.map(u => ({ ...u, department_id: null, is_active: true }))
    );
    if (error) throw error;

    return NextResponse.json({ ok: true, inserted: users.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
