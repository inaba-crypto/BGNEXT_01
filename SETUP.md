# セットアップ手順書

## 1. GitHubリポジトリの作成

### 1-1. GitHub にログイン
https://github.com にアクセスしてログイン

### 1-2. 新しいリポジトリを作成
1. 右上の「+」ボタンをクリック
2. 「New repository」を選択
3. 以下の情報を入力:
   - Repository name: `playwright-seminar-checker`
   - Description: セミナーサイト自動巡回システム
   - **Private** を選択（重要: 認証情報を含むため）
   - 「Add a README file」は**チェックしない**
4. 「Create repository」をクリック

## 2. ローカルでの準備（方法A: Gitコマンド使用）

### 2-1. ファイルをダウンロード
Claude が作成したファイル一式をダウンロード

### 2-2. Gitリポジトリとして初期化
```bash
cd playwright-seminar-checker
git init
git add .
git commit -m "Initial commit"
```

### 2-3. GitHubにプッシュ
```bash
git remote add origin https://github.com/YOUR_USERNAME/playwright-seminar-checker.git
git branch -M main
git push -u origin main
```

## 3. ローカルでの準備（方法B: GitHub Web UI使用）

### 3-1. ファイルを手動アップロード
1. GitHubリポジトリページで「Add file」→「Upload files」
2. 全てのファイルをドラッグ&ドロップ
3. 「Commit changes」をクリック

**注意**: この方法の場合、ディレクトリ構造を維持するため、以下の順番でアップロード:
1. まず `package.json`, `README.md`, `.gitignore` をアップロード
2. 次に「Create new file」で `.github/workflows/seminar-check.yml` を作成
3. 同様に `src/checker.js`, `src/logger.js` を作成
4. 同様に `data/sites.csv` を作成

## 4. CSVファイルの準備

### 4-1. sites.csv を編集
`data/sites.csv` を開いて、実際の800サイトの情報に置き換え:

```csv
id,login_url,username,password
22nKuR3oFrGwk,http://www.esod-neo.com/client_certify_to_logon.php?id=22nKuR3oFrGwk,actual_user_001,actual_pass_001
XXXXXX,http://www.esod-neo.com/client_certify_to_logon.php?id=XXXXXX,actual_user_002,actual_pass_002
...（全800行）
```

### 4-2. Excel から CSV に変換する場合
1. Excelで既存のサイトリストを開く
2. 列の並びを確認: `id`, `login_url`, `username`, `password`
3. 「ファイル」→「名前を付けて保存」
4. ファイル形式: 「CSV UTF-8 (コンマ区切り) (*.csv)」
5. 保存場所: `data/sites.csv`

### 4-3. CSVファイルをGitHubに反映
```bash
git add data/sites.csv
git commit -m "Update sites.csv with actual data"
git push
```

または GitHub Web UI で:
1. `data/sites.csv` ファイルを開く
2. 鉛筆アイコン（Edit）をクリック
3. 内容を貼り付け
4. 「Commit changes」

## 5. GitHub Actions の有効化と権限設定

### 5-1. Actions を有効化
1. リポジトリの「Settings」タブをクリック
2. 左メニュー「Actions」→「General」をクリック
3. 「Actions permissions」セクションで:
   - 「Allow all actions and reusable workflows」を選択
4. 「Workflow permissions」セクションで:
   - 「Read and write permissions」を選択（ログコミット用）
5. 「Save」をクリック

## 6. 動作確認

### 6-1. 手動実行でテスト
1. リポジトリの「Actions」タブをクリック
2. 左メニューで「セミナーサイト巡回チェック」を選択
3. 右上の「Run workflow」ボタンをクリック
4. 「Run workflow」を再度クリック
5. 実行が開始されます（約30秒で開始）

### 6-2. ログの確認
1. 実行中/完了したワークフローをクリック
2. 「check-sites」ジョブをクリック
3. 各ステップを展開してログを確認
   - 「サイト巡回チェックを実行」で詳細なログが見られます

### 6-3. ログファイルのダウンロード
1. ワークフロー実行画面の下部「Artifacts」セクション
2. 「execution-logs-XXX」をクリックしてダウンロード
3. ZIPを解凍して JSON ログファイルを確認

## 7. スケジュール実行の確認

### 7-1. 次回の実行予定
- 毎日午前10時（JST）
- 毎日午後10時（JST）

### 7-2. スケジュールの変更方法
`.github/workflows/seminar-check.yml` を編集:

```yaml
schedule:
  # 午前10時(JST) = 午前1時(UTC)
  - cron: '0 1 * * *'
  # 午後3時(JST) = 午前6時(UTC)  
  - cron: '0 6 * * *'
```

**Cron 表記法**:
```
分 時 日 月 曜日
0  1  *  *  *   = 毎日 1:00 UTC (10:00 JST)
```

## 8. トラブルシューティング

### エラー: "Resource not accessible by integration"
**原因**: GitHub Actions の権限不足
**解決**: Settings → Actions → General で「Read and write permissions」を選択

### エラー: "sites.csv not found"
**原因**: CSVファイルがアップロードされていない
**解決**: `data/sites.csv` が正しくリポジトリにあるか確認

### 実行が途中で止まる
**原因**: 特定のサイトでハングアップ
**解決**: 
1. ログで問題のサイトIDを特定
2. そのサイトのURLやログイン情報を確認
3. 一時的にCSVから除外してテスト

### ログインに失敗する
**原因**: 
- ログイン情報が間違っている
- サイトのHTML構造が変更された

**解決**:
1. CSV の username/password を確認
2. 手動でログインしてHTML構造を確認
3. 必要に応じて `src/checker.js` のセレクターを修正

### 800サイトが60分で終わらない
**対策1**: 待機時間を短縮
```javascript
// src/checker.js の CONFIG を変更
const CONFIG = {
  minWaitTime: 500,   // 1000 → 500 に短縮
  maxWaitTime: 1500,  // 3000 → 1500 に短縮
  ...
};
```

**対策2**: 複数回に分割
```javascript
// 例: 1回につき400サイトずつ処理
const sites = this.readSitesFromCSV();
const batchSize = 400;
const startIndex = process.env.BATCH_INDEX ? parseInt(process.env.BATCH_INDEX) * batchSize : 0;
const endIndex = startIndex + batchSize;
const sitesToCheck = sites.slice(startIndex, endIndex);
```

そしてワークフローを2つに分ける:
```yaml
# .github/workflows/seminar-check-batch1.yml
- name: サイト巡回チェックを実行（前半）
  env:
    BATCH_INDEX: 0
  run: npm start

# .github/workflows/seminar-check-batch2.yml  
- name: サイト巡回チェックを実行（後半）
  env:
    BATCH_INDEX: 1
  run: npm start
```

## 9. カスタマイズ

### 動画ボタンのセレクター追加
サイトの構造に応じて、`src/checker.js` のセレクターを追加:

```javascript
const videoButtonSelectors = [
  'a:has-text("再生")',
  'a:has-text("視聴")',
  'button:has-text("再生")',
  // 新しいセレクターを追加
  'a.your-custom-class',
  '#your-video-button-id',
];
```

### 通知機能の追加
GitHub Actions でエラー時にメール通知:

```yaml
- name: エラー通知
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{secrets.MAIL_USERNAME}}
    password: ${{secrets.MAIL_PASSWORD}}
    subject: セミナーサイトチェック失敗
    body: 実行に失敗しました
    to: your-email@example.com
    from: GitHub Actions
```

## 10. 定期メンテナンス

### 月次確認事項
- [ ] 実行ログに異常なエラーがないか
- [ ] 成功率が低下していないか  
- [ ] 新規サイトの追加があるか

### サイト情報の更新
1. CSV を編集（追加・削除・変更）
2. Git にコミット・プッシュ
3. 次回の自動実行で反映

以上でセットアップ完了です！
