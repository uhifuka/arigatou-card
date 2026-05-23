# ありがとうカード - 上田皮ふ科 社内感謝メッセージシステム

スタッフ同士が感謝メッセージを送り合うデジタルシステムです。

---

## 技術構成

| カテゴリ | 技術 |
|---|---|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| スタイリング | Tailwind CSS |
| バックエンド | Next.js API Routes |
| データベース | Supabase PostgreSQL |
| 認証 | Supabase Auth |
| グラフ | Recharts |

---

## セットアップ手順

### 1. リポジトリのクローン・依存関係インストール

```bash
git clone <your-repo>
cd arigatou-card
npm install
```

### 2. Supabaseプロジェクトの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 新規プロジェクトを作成
3. Project URL と anon key を取得

### 3. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=http://localhost:3000
```

### 4. データベースのセットアップ

Supabase の SQL Editor で `supabase/migrations/001_initial_schema.sql` を実行してください。

### 5. 初期データの投入

Supabase SQL Editor で `supabase/migrations/002_seed_data.sql` を実行。

デフォルトの管理者アカウント：
- ログインID: `admin`
- パスワード: `admin1234`（初回ログイン後に必ず変更してください）

### 6. 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にアクセス。

---

## ディレクトリ構成

```
arigatou-card/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # トップページ（ログインへリダイレクト）
│   │   ├── login/               # ログイン画面
│   │   ├── staff/               # スタッフ画面
│   │   ├── admin/               # 管理者画面
│   │   │   ├── dashboard/       # ダッシュボード
│   │   │   ├── staff/           # スタッフ一覧
│   │   │   ├── history/         # ありがとう履歴
│   │   │   └── ranking/         # ランキング
│   │   └── api/                 # API Routes
│   │       ├── auth/            # 認証API
│   │       ├── thanks/          # ありがとうAPI
│   │       ├── users/           # ユーザーAPI
│   │       └── admin/           # 管理者API
│   ├── components/
│   │   ├── ui/                  # 共通UIコンポーネント
│   │   ├── staff/               # スタッフ画面コンポーネント
│   │   └── admin/               # 管理者画面コンポーネント
│   ├── lib/
│   │   ├── supabase.ts          # Supabaseクライアント
│   │   ├── auth.ts              # 認証ヘルパー
│   │   └── utils.ts             # ユーティリティ関数
│   ├── types/
│   │   └── index.ts             # 型定義
│   └── hooks/
│       └── useAuth.ts           # 認証フック
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_seed_data.sql
├── .env.local                   # 環境変数（gitignore済み）
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 主な機能

### スタッフ
- ありがとうメッセージの送信
- 送信・受信履歴の確認
- 送受信数の確認

### 管理者
- 全スタッフ管理（追加・編集・削除）
- 全ありがとう履歴の閲覧・検索
- 月別ランキング（送信・受信）
- ダッシュボード（グラフ表示）

---

## 将来の拡張予定

- [ ] コメントへの返信機能
- [ ] スタンプ・リアクション機能
- [ ] 部署別ランキング
- [ ] CSV出力
- [ ] メール通知
- [ ] スマホプッシュ通知

---

## セキュリティ注意事項

- パスワードはbcryptでハッシュ化されています
- 管理者ページはロール認証で保護されています
- セッションはJWTで管理されています
- 本番環境では必ず `NEXTAUTH_SECRET` を強力なランダム文字列に変更してください
