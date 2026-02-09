# セミナーサイト自動巡回システム

GitHub Actions + Playwrightを使用した800サイトの自動巡回・動作確認システム

## 機能

- 800サイトの自動ログイン・動画視聴確認
- CSVファイルからサイト情報を自動読み込み
- 毎日自動実行（GitHub Actions）
- 手動実行も可能
- 詳細なログ記録
- エラー時も継続処理

## セットアップ手順

### 1. GitHubリポジトリの作成

1. GitHubにログイン
2. 右上の「+」→「New repository」
3. リポジトリ名: `playwright-seminar-checker` (任意)
4. Privateを選択（推奨）
5. 「Create repository」をクリック

### 2. ファイルのアップロード

以下のファイルをリポジトリにアップロード:

```
playwright-seminar-checker/
├── .github/
│   └── workflows/
│       └── seminar-check.yml
├── src/
│   ├── checker.js
│   └── logger.js
├── data/
│   └── sites.csv
├── package.json
└── README.md
```

### 3. CSVファイルの準備

`data/sites.csv` に以下の形式でサイト情報を記載:

```csv
id,login_url,username,password
22nKuR3oFrGwk,http://www.esod-neo.com/client_certify_to_logon.php?id=22nKuR3oFrGwk,testuser001,password001
XXXXXXXXX,http://www.esod-neo.com/client_certify_to_logon.php?id=XXXXXXXXX,testuser002,password002
...
```

### 4. GitHub Actionsの有効化

1. リポジトリの「Settings」タブ
2. 左メニュー「Actions」→「General」
3. 「Allow all actions and reusable workflows」を選択
4. 「Save」

### 5. 実行確認

#### 手動実行
1. リポジトリの「Actions」タブ
2. 左メニュー「セミナーサイト巡回チェック」
3. 右上「Run workflow」→「Run workflow」

#### 自動実行
- 毎日午前10時（JST）に自動実行
- 毎日午後10時（JST）に自動実行

### 6. ログの確認

1. 「Actions」タブ
2. 実行履歴をクリック
3. 「check-sites」ジョブをクリック
4. ログの詳細を確認

## 設定のカスタマイズ

### 実行スケジュールの変更

`.github/workflows/seminar-check.yml` の `cron` を編集:

```yaml
schedule:
  - cron: '0 1 * * *'   # 毎日午前10時(JST)
  - cron: '0 13 * * *'  # 毎日午後10時(JST)
```

### 巡回サイト数の変更

800サイト全てを1回で巡回すると時間がかかる場合:

`src/checker.js` の設定を変更:

```javascript
// 全サイト巡回
const sites = readSitesFromCSV();

// または一部のみ巡回（例: 最初の100サイト）
const sites = readSitesFromCSV().slice(0, 100);
```

## トラブルシューティング

### エラー: "Resource not accessible by integration"
- Settings → Actions → General で権限を確認

### 実行が60分でタイムアウト
- サイト数を分割して複数回に分けて実行
- `checker.js` のwaitTime（待機時間）を短縮

### ログイン失敗が多発
- CSVファイルの認証情報を確認
- セレクターが正しいか確認（サイトのHTML変更の可能性）

## お問い合わせ

システムに関する質問や改善提案は、Issuesでお知らせください。
