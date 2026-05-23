# デプロイ手順書 — 無料で本番公開する方法

使用するサービス（すべて無料枠）:
| サービス | 用途 | 無料枠 |
|---|---|---|
| GitHub | コード管理 | 無制限 |
| Supabase | データベース (PostgreSQL) | 500MB, 2プロジェクト |
| Vercel | Webホスティング | 100GB帯域/月 |

---

## STEP 1 — Supabase セットアップ

### 1-1. アカウント作成
1. https://supabase.com にアクセス
2. 「Start your project」→ GitHubアカウントでサインアップ（無料）

### 1-2. プロジェクト作成
1. 「New project」をクリック
2. 設定:
   - **Name**: `arigatou-card`
   - **Database Password**: 強いパスワードを設定（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択
3. 「Create new project」をクリック（2〜3分待つ）

### 1-3. データベース初期化
1. 左メニュー「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/migrations/001_initial_schema.sql` の内容をすべて貼り付けて実行（Run）
4. 成功したら「New query」でもう一度
5. `supabase/migrations/002_seed_data.sql` の内容を貼り付けて実行

### 1-4. APIキーを取得
1. 左メニュー「Project Settings」→「API」
2. 以下の3つをメモ:
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **anon / public**: `eyJh...` (長い文字列)
   - **service_role**: `eyJh...` (長い文字列、絶対に公開しないこと)

---

## STEP 2 — GitHub リポジトリ作成 & コードをプッシュ

### 2-1. GitHubアカウント作成（既にある場合はスキップ）
1. https://github.com にアクセス
2. 「Sign up」から無料アカウント作成

### 2-2. リポジトリ作成
1. https://github.com/new にアクセス
2. 設定:
   - **Repository name**: `arigatou-card`
   - **Visibility**: `Private`（社内システムのため）
3. 「Create repository」をクリック

### 2-3. コードをプッシュ
表示されたURLをコピーして、コマンドプロンプト（またはPowerShell）で実行:

```bash
cd C:\Users\Ueda32\Desktop\arigatou-card
git remote add origin https://github.com/あなたのユーザー名/arigatou-card.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Vercel デプロイ

### 3-1. Vercelアカウント作成
1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」で無料登録

### 3-2. プロジェクトのインポート
1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubのリポジトリ一覧から `arigatou-card` を選択
3. 「Import」をクリック

### 3-3. 環境変数を設定（重要）
「Environment Variables」セクションに以下を追加:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseのProject URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseのanon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseのservice_role key |
| `NEXTAUTH_SECRET` | `rFs8AOT0OUb5Z358OPih9dZBPT+bLz7ikrCKHXcf/k8=` |

> ⚠️ `NEXTAUTH_SECRET` は上記の値をそのまま使用するか、新しいランダム文字列を設定してください

### 3-4. デプロイ実行
1. 「Deploy」をクリック
2. 2〜3分待つと完成
3. `https://arigatou-card-xxx.vercel.app` のようなURLが発行される

---

## STEP 4 — 動作確認

デプロイ後、以下のアカウントでログイン確認:

| ロール | ログインID | パスワード |
|---|---|---|
| 管理者 | `admin` | `admin1234` |
| スタッフ | `ueda001` | `staff1234` |

> ⚠️ 本番運用前に必ずパスワードを変更してください（管理者画面→スタッフ管理）

---

## STEP 5 — 独自ドメインの設定（任意）

Vercelの無料プランでも独自ドメインを設定できます:
1. Vercelダッシュボード→プロジェクト→「Settings」→「Domains」
2. 取得済みドメインを入力して「Add」
3. DNSレコードの設定手順が表示されるので従う

---

## 継続的なデプロイについて

GitHubにコードをプッシュするたびに、Vercelが自動的に再デプロイします:

```bash
git add .
git commit -m "変更内容"
git push
```

これだけで本番環境が自動更新されます。

---

## 無料枠の制限について

| サービス | 制限 | 上田皮ふ科規模での目安 |
|---|---|---|
| Supabase DB | 500MB | スタッフ20名、5年分でも余裕 |
| Supabase 帯域 | 2GB/月 | 問題なし |
| Vercel 帯域 | 100GB/月 | 問題なし |
| Vercel 関数 | 100GB-hrs/月 | 問題なし |

→ **上田皮ふ科規模では無料枠で十分です**
