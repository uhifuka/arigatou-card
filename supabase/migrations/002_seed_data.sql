-- =============================================
-- 002_seed_data.sql
-- 初期データ投入（開発・テスト用）
-- =============================================
-- パスワードはすべて bcrypt ハッシュ済み
-- admin1234 -> $2b$10$... (下記ハッシュ)
-- staff1234 -> $2b$10$... (下記ハッシュ)
-- ※本番環境では必ず変更してください

-- 部署データ
INSERT INTO departments (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', '診療'),
  ('22222222-2222-2222-2222-222222222222', '看護'),
  ('33333333-3333-3333-3333-333333333333', '受付・医療クラーク'),
  ('44444444-4444-4444-4444-444444444444', '広報・事務');

-- 管理者アカウント
-- パスワード: admin1234
INSERT INTO users (id, login_id, name, password_hash, role, department_id) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'admin',
    '管理者',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.TIKz5.wJHuD6YkZ4A5C7mN8rWvQpLei',
    'admin',
    NULL
  );

-- スタッフアカウント（サンプル）
-- パスワード全員: staff1234
INSERT INTO users (id, login_id, name, password_hash, role, department_id) VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01',
    'ueda001',
    '上田 花子',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.wX2mKj3L8nP9qR6sT4uV7yA1bC3dE5f',
    'staff',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02',
    'ueda002',
    '山田 太郎',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.wX2mKj3L8nP9qR6sT4uV7yA1bC3dE5f',
    'staff',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03',
    'ueda003',
    '佐藤 美咲',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.wX2mKj3L8nP9qR6sT4uV7yA1bC3dE5f',
    'staff',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04',
    'ueda004',
    '田中 春奈',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.wX2mKj3L8nP9qR6sT4uV7yA1bC3dE5f',
    'staff',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05',
    'ueda005',
    '鈴木 恵',
    '$2b$10$rOzJqSk1FqjGQ5bXkFmZO.wX2mKj3L8nP9qR6sT4uV7yA1bC3dE5f',
    'staff',
    '44444444-4444-4444-4444-444444444444'
  );

-- サンプルありがとうメッセージ
INSERT INTO thanks_messages (sender_id, receiver_id, message, sent_date) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '忙しい処置中にフォローしてくれてありがとう！助かりました。', CURRENT_DATE - INTERVAL '1 day'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', '患者さんへの丁寧な対応、いつも勉強になります。', CURRENT_DATE - INTERVAL '2 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '急な対応お願いしてしまってすみません。本当に助かりました！', CURRENT_DATE - INTERVAL '3 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb05', 'SNS投稿のサポートありがとうございます。とても参考になりました。', CURRENT_DATE - INTERVAL '5 days'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb04', '受付でのクレーム対応、本当に冷静で上手だったね。お疲れ様でした。', CURRENT_DATE - INTERVAL '7 days');
