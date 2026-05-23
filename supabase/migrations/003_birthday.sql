-- =============================================
-- 003_birthday.sql
-- 誕生日カラム追加
-- =============================================

-- users テーブルに birthday カラムを追加（形式: 'MM-DD'）
ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday TEXT;

-- user_stats ビューを再作成して birthday を含める
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.login_id,
  u.name,
  u.role,
  u.birthday,
  d.name AS department_name,
  COALESCE(sent.send_count, 0) AS send_count,
  COALESCE(received.receive_count, 0) AS receive_count
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN (
  SELECT sender_id, COUNT(*) AS send_count
  FROM thanks_messages
  GROUP BY sender_id
) sent ON u.id = sent.sender_id
LEFT JOIN (
  SELECT receiver_id, COUNT(*) AS receive_count
  FROM thanks_messages
  GROUP BY receiver_id
) received ON u.id = received.receiver_id
WHERE u.is_active = TRUE;
