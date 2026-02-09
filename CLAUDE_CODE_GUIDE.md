# Claude Code でプロジェクトを実行する方法

Claude Codeは、ターミナル上で動作するAIコーディングアシスタントです。
このガイドでは、PlaywrightセミナーチェッカープロジェクトをClaude Codeで実行・管理する方法を説明します。

---

## Claude Code とは？

Claude Codeは、Anthropicが提供するコマンドライン型のAIコーディングツールです。

**特徴**:
- コードベース全体を理解して作業を支援
- 自然言語でタスクを指示できる
- Git操作、テスト実行、コード修正などを自動化
- ターミナルやIDEから直接使用可能

**公式ドキュメント**: https://code.claude.com/docs

---

## ステップ1: Claude Code のインストール

### 方法A: Native Binary（推奨）

#### Mac / Linux / WSL
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Windows PowerShell
```powershell
irm https://claude.ai/install.ps1 | iex
```

#### Windows CMD
```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 方法B: Homebrew（Mac）
```bash
brew install --cask claude-code
```

### 方法C: WinGet（Windows）
```powershell
winget install Anthropic.ClaudeCode
```

### 方法D: npm（非推奨）
```bash
npm install -g @anthropic-ai/claude-code
```

**注意**:
- Native Binary が最も推奨されます（自動更新、安定性）
- npmインストールには Node.js 18+ が必要
- Windowsユーザーは WSL または Git Bash の使用を推奨

### インストール確認

```bash
claude --version
```

または

```bash
claude doctor
```

---

## ステップ2: Claude Code の認証

初回実行時に認証が必要です。

```bash
claude
```

1. ブラウザが自動的に開きます
2. Anthropicアカウントでログイン
3. 認証完了後、ターミナルに戻ります

---

## ステップ3: プロジェクトのセットアップ

### 3-1. プロジェクトをダウンロード・解凍

```bash
# ZIPファイルを解凍（既に完了している場合はスキップ）
cd ~/Downloads
unzip playwright-seminar-checker.zip
cd playwright-seminar-checker
```

### 3-2. 依存パッケージをインストール

```bash
npm install
npx playwright install --with-deps chromium
```

### 3-3. 環境変数を設定（スプレッドシート使用の場合）

#### Mac / Linux / WSL
```bash
export GOOGLE_SPREADSHEET_ID='1aFlO3X5mk0ELARP4K8NIJbj99A8zZN06Z0isRGIP_Gw'
export GOOGLE_SHEET_GID='0'
```

#### Windows PowerShell
```powershell
$env:GOOGLE_SPREADSHEET_ID='1aFlO3X5mk0ELARP4K8NIJbj99A8zZN06Z0isRGIP_Gw'
$env:GOOGLE_SHEET_GID='0'
```

**永続的に設定する場合**:

`.env` ファイルを作成:
```bash
# プロジェクトルートに .env ファイルを作成
cat > .env << 'EOF'
GOOGLE_SPREADSHEET_ID=1aFlO3X5mk0ELARP4K8NIJbj99A8zZN06Z0isRGIP_Gw
GOOGLE_SHEET_GID=0
EOF
```

そして `src/checker.js` の先頭に追加:
```javascript
require('dotenv').config();
```

dotenv をインストール:
```bash
npm install dotenv
```

---

## ステップ4: Claude Code でプロジェクトを実行

### 4-1. Claude Code を起動

```bash
cd playwright-seminar-checker
claude
```

### 4-2. Claude に指示を出す

Claude Code が起動したら、自然言語で指示できます。

#### 例1: スクリプトを実行

```
プロジェクトを実行して、サイト巡回チェックを開始してください。
```

または

```
npm start を実行して、実行ログを確認してください。
```

#### 例2: 特定のサイトだけテスト

```
最初の10サイトだけチェックするように src/checker.js を修正して実行してください。
```

#### 例3: エラーを修正

```
実行時にエラーが発生しました。ログを確認して修正してください。

[エラーメッセージを貼り付け]
```

#### 例4: コードの説明を求める

```
src/checker.js の checkSite メソッドがどのように動作しているか説明してください。
```

#### 例5: 機能追加

```
ログインに失敗したサイトのリストを別のCSVファイルに出力する機能を追加してください。
```

### 4-3. Claude Code のコマンド

Claude Code 内で使える特殊コマンド:

```
/help       - ヘルプを表示
/clear      - 会話履歴をクリア
/exit       - Claude Code を終了
/bug        - バグレポートを送信
/reset      - セッションをリセット
```

---

## ステップ5: 直接実行（Claude Code なし）

Claude Code を使わず、通常のNode.jsスクリプトとして実行することもできます。

### 方法1: npm scripts

```bash
npm start
```

### 方法2: 直接実行

```bash
node src/checker.js
```

### 方法3: テストモード（最初の数サイトのみ）

`src/checker.js` を編集:

```javascript
// 全サイトを読み込み
const sites = await this.readSitesFromCSV();

// 最初の5サイトだけテスト
const sitesToCheck = sites.slice(0, 5);
```

---

## Claude Code の活用例

### 例1: コードレビューとリファクタリング

```bash
claude
```

```
src/checker.js のコードをレビューして、改善点を提案してください。
特にエラーハンドリングとパフォーマンスに注目してください。
```

### 例2: 新機能の実装

```
以下の機能を追加してください:
1. 実行開始時にSlackに通知を送る
2. 失敗したサイトは3回までリトライする
3. 実行完了時に成功率のグラフをHTML形式で出力する
```

### 例3: デバッグ支援

```
以下のエラーが発生しています。原因を特定して修正してください:

[エラーログを貼り付け]
```

### 例4: ドキュメント生成

```
このプロジェクトの技術仕様書を作成してください。
以下の内容を含めてください:
- アーキテクチャ概要
- 主要クラスとメソッドの説明
- データフロー
- エラーハンドリング戦略
```

### 例5: テストコード作成

```
src/checker.js の checkSite メソッドのユニットテストを作成してください。
Jestを使用して、正常系と異常系をカバーしてください。
```

---

## トラブルシューティング

### エラー: "command not found: claude"

**原因**: PATHが設定されていない

**解決** (Mac/Linux):
```bash
echo 'export PATH="$HOME/.claude/bin:$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**解決** (Mac - zsh):
```bash
echo 'export PATH="$HOME/.claude/bin:$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### エラー: "Insufficient permissions"

**原因**: npmでグローバルインストール時の権限問題

**解決**: Native Binary に移行
```bash
# npm版をアンインストール
npm uninstall -g @anthropic-ai/claude-code

# Native Binary をインストール
curl -fsSL https://claude.ai/install.sh | bash
```

### エラー: スプレッドシートが読み込めない

**原因**: 環境変数が設定されていない、または共有設定が正しくない

**解決**:
1. 環境変数を確認:
   ```bash
   echo $GOOGLE_SPREADSHEET_ID
   ```
2. スプレッドシートの共有設定を確認（「リンクを知っている全員」→「閲覧者」）

### Playwrightのインストールエラー

**原因**: システム依存関係が不足

**解決** (Ubuntu/Debian):
```bash
sudo npx playwright install-deps chromium
```

**解決** (Mac):
```bash
npx playwright install --with-deps chromium
```

### Windows での実行エラー

**原因**: Windowsでは WSL または Git Bash が必要

**解決**:
1. WSL2 をインストール
2. WSL内でプロジェクトを実行

または

1. Git Bash をインストール
2. Git Bash内でClaude Codeを実行

---

## Claude Code vs GitHub Actions の比較

| 項目 | Claude Code | GitHub Actions |
|------|-------------|----------------|
| 実行場所 | ローカルマシン | クラウド |
| スケジュール実行 | 手動実行が基本 | 自動スケジュール可能 |
| コスト | Claudeの使用量に応じて課金 | 月2,000分まで無料 |
| 開発・デバッグ | 対話的で柔軟 | ログベースの確認 |
| 本番運用 | 不向き | 向いている |

**推奨される使い分け**:
- **開発・テスト**: Claude Code（素早く試行錯誤）
- **本番・定期実行**: GitHub Actions（安定した自動実行）

---

## Claude Code のベストプラクティス

### 1. 明確な指示を出す

&#x274C; 悪い例:
```
エラーを直して
```

&#x2705; 良い例:
```
ログイン処理でタイムアウトエラーが発生しています。
CONFIG.loginTimeout を 10000 から 30000 に変更して、
エラーハンドリングも改善してください。
```

### 2. コンテキストを提供する

```
このプロジェクトは800サイトの自動巡回テストを行うものです。
現在、一部のサイトでログインに失敗しています。
src/checker.js の checkSite メソッドを確認して、
ログイン失敗時のリトライロジックを追加してください。
```

### 3. 段階的に作業する

```
ステップ1: まず src/checker.js を読んで、現在の構造を説明してください。
ステップ2: ログイン失敗時のリトライ機能の設計を提案してください。
ステップ3: 設計に基づいてコードを実装してください。
ステップ4: テスト実行して動作を確認してください。
```

### 4. コードレビューを依頼する

```
実装が完了したら、以下の観点でレビューしてください:
1. セキュリティ上の問題はないか
2. パフォーマンスの問題はないか
3. エラーハンドリングは適切か
4. コードの可読性は良いか
```

---

## まとめ

Claude Codeは開発・デバッグ・実験に最適なツールです:

&#x2705; **開発フェーズ**: Claude Codeで素早くプロトタイプ作成
&#x2705; **テストフェーズ**: Claude Codeで対話的にデバッグ
&#x2705; **本番運用**: GitHub Actionsで自動実行

両方を組み合わせることで、最大の効率を得られます。

---

## 関連ドキュメント

- **Claude Code 公式ドキュメント**: https://code.claude.com/docs
- **QUICKSTART.md** - プロジェクトの簡易セットアップ
- **GITHUB_SETUP_DETAILED.md** - GitHub Actionsでの自動実行
- **GOOGLE_SHEETS_GUIDE.md** - スプレッドシート設定

---

## サポート

Claude Code の問題:
- `/bug` コマンドでバグレポート送信
- GitHub: https://github.com/anthropics/claude-code/issues
- Discord: Claude Developers Discord

プロジェクトの問題:
- GitHub リポジトリの Issues
