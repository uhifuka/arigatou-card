-- =============================================
-- 001_initial_schema.sql
-- ありがとうカードシステム 初期スキーマ
-- =============================================

-- UUID拡張
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- テーブル: departments（部署）
-- =============================================
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- テーブル: users（スタッフ・管理者）
-- =============================================
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  login_id TEXT UNIQUE NOT NULL,          -- ログインID
  name TEXT NOT NULL,                      -- 氏名
  password_hash TEXT NOT NULL,             -- bcryptハッシュ
  role TEXT NOT NULL DEFAULT 'staff'       -- 'staff' | 'admin'
    CHECK (role IN ('staff', 'admin')),
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,          -- 有効/無効フラグ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- テーブル: thanks_messages（ありがとうメッセージ）
-- =============================================
CREATE TABLE thanks_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- バリデーション: 自分自身には送れない
  CONSTRAINT no_self_thanks CHECK (sender_id != receiver_id)
);

-- =============================================
-- インデックス（パフォーマンス最適化）
-- =============================================
CREATE INDEX idx_thanks_sender ON thanks_messages(sender_id);
CREATE INDEX idx_thanks_receiver ON thanks_messages(receiver_id);
CREATE INDEX idx_thanks_sent_date ON thanks_messages(sent_date);
CREATE INDEX idx_thanks_year_month ON thanks_messages(DATE_TRUNC('month', sent_date));
CREATE INDEX idx_users_login_id ON users(login_id);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- ビュー: thanks_with_names（名前付きメッセージ一覧）
-- =============================================
CREATE OR REPLACE VIEW thanks_with_names AS
SELECT
  tm.id,
  tm.message,
  tm.sent_date,
  tm.created_at,
  s.id AS sender_id,
  s.name AS sender_name,
  s.login_id AS sender_login_id,
  r.id AS receiver_id,
  r.name AS receiver_name,
  r.login_id AS receiver_login_id,
  ds.name AS sender_department,
  dr.name AS receiver_department
FROM thanks_messages tm
JOIN users s ON tm.sender_id = s.id
JOIN users r ON tm.receiver_id = r.id
LEFT JOIN departments ds ON s.department_id = ds.id
LEFT JOIN departments dr ON r.department_id = dr.id;

-- =============================================
-- ビュー: monthly_stats（月別統計）
-- =============================================
CREATE OR REPLACE VIEW monthly_stats AS
SELECT
  DATE_TRUNC('month', sent_date) AS month,
  COUNT(*) AS total_count
FROM thanks_messages
GROUP BY DATE_TRUNC('month', sent_date)
ORDER BY month;

-- =============================================
-- ビュー: user_stats（ユーザー別送受信統計）
-- =============================================
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.login_id,
  u.name,
  u.role,
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

-- =============================================
-- 関数: get_monthly_ranking（月別ランキング取得）
-- =============================================
CREATE OR REPLACE FUNCTION get_monthly_ranking(
  target_year INT,
  target_month INT,
  rank_type TEXT  -- 'send' | 'receive'
)
RETURNS TABLE(
  rank BIGINT,
  user_id UUID,
  user_name TEXT,
  department_name TEXT,
  count BIGINT
) AS $$
BEGIN
  IF rank_type = 'send' THEN
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank,
      u.id AS user_id,
      u.name AS user_name,
      d.name AS department_name,
      COUNT(*) AS count
    FROM thanks_messages tm
    JOIN users u ON tm.sender_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE EXTRACT(YEAR FROM tm.sent_date) = target_year
      AND EXTRACT(MONTH FROM tm.sent_date) = target_month
    GROUP BY u.id, u.name, d.name
    ORDER BY COUNT(*) DESC;
  ELSE
    RETURN QUERY
    SELECT
      ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS rank,
      u.id AS user_id,
      u.name AS user_name,
      d.name AS department_name,
      COUNT(*) AS count
    FROM thanks_messages tm
    JOIN users u ON tm.receiver_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE EXTRACT(YEAR FROM tm.sent_date) = target_year
      AND EXTRACT(MONTH FROM tm.sent_date) = target_month
    GROUP BY u.id, u.name, d.name
    ORDER BY COUNT(*) DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- updated_at 自動更新トリガー
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
