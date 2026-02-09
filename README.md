# BGNEXT_01

BGNEXTサイト

## セットアップ

```bash
npm install
```

### 環境変数の設定

`.env.example` を `.env.local` にコピーし、値を設定してください。

```bash
cp .env.example .env.local
```

#### GitHub OAuth Appの作成

1. [GitHub Developer Settings](https://github.com/settings/developers) にアクセス
2. 「New OAuth App」をクリック
3. 以下を設定:
   - **Application name**: 任意の名前
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. 作成後、Client IDとClient Secretを `.env.local` に設定

#### AUTH_SECRETの生成

```bash
npx auth secret
```

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。
