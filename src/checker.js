const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Logger = require('./logger');

// 設定
const CONFIG = {
  // 各サイトでの最小待機時間（ミリ秒）
  minWaitTime: 1000,
  // 各サイトでの最大待機時間（ミリ秒）
  maxWaitTime: 3000,
  // ページ読み込みタイムアウト（ミリ秒）
  pageTimeout: 30000,
  // ログインタイムアウト（ミリ秒）
  loginTimeout: 10000,
  // 動画ページ待機時間（ミリ秒）
  videoPageWaitTime: 2000,
  // ヘッドレスモード
  headless: true
};

class SeminarChecker {
  constructor() {
    this.logger = new Logger();
    this.browser = null;
    this.successCount = 0;
    this.failCount = 0;
  }

  // CSVファイルからサイト情報を読み込み
  readSitesFromCSV() {
    const csvPath = path.join(__dirname, '../data/sites.csv');
    
    if (!fs.existsSync(csvPath)) {
      this.logger.error(`CSVファイルが見つかりません: ${csvPath}`);
      throw new Error('sites.csv not found');
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    this.logger.info(`${records.length}サイトの情報を読み込みました`);
    return records;
  }

  // ランダムな待機時間を生成
  getRandomWaitTime() {
    const min = CONFIG.minWaitTime;
    const max = CONFIG.maxWaitTime;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ブラウザを起動
  async initBrowser() {
    this.logger.info('ブラウザを起動中...');
    this.browser = await chromium.launch({
      headless: CONFIG.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.logger.success('ブラウザ起動完了');
  }

  // ブラウザを終了
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.logger.info('ブラウザを終了しました');
    }
  }

  // 単一サイトをチェック
  async checkSite(site) {
    const { id, login_url, username, password } = site;
    const context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    page.setDefaultTimeout(CONFIG.pageTimeout);

    try {
      this.logger.info(`ログインページにアクセス中`, id);
      
      // ログインページにアクセス
      await page.goto(login_url, { waitUntil: 'networkidle' });
      
      // ログインフォームが表示されるまで待機
      await page.waitForSelector('input[name="user_id"]', { timeout: CONFIG.loginTimeout });
      
      this.logger.info(`ログイン情報を入力中`, id);
      
      // ログイン情報を入力
      await page.fill('input[name="user_id"]', username);
      await page.fill('input[name="password"]', password);
      
      // ログインボタンをクリック
      this.logger.info(`ログインボタンをクリック`, id);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: CONFIG.pageTimeout }),
        page.click('button[name="submit"]')
      ]);

      this.logger.success(`ログイン成功`, id);

      // 動画一覧ページに遷移したことを確認
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(CONFIG.videoPageWaitTime);

      // 動画再生ボタンを探す（複数の可能性に対応）
      const videoButtonSelectors = [
        'a:has-text("再生")',
        'a:has-text("視聴")',
        'button:has-text("再生")',
        'button:has-text("視聴")',
        '.video-play-button',
        '.play-button',
        'a[href*="play"]',
        'a[href*="video"]'
      ];

      let videoButton = null;
      for (const selector of videoButtonSelectors) {
        try {
          videoButton = await page.$(selector);
          if (videoButton) {
            this.logger.info(`動画ボタン発見: ${selector}`, id);
            break;
          }
        } catch (e) {
          // 次のセレクターを試す
          continue;
        }
      }

      if (videoButton) {
        this.logger.info(`動画再生ボタンをクリック`, id);
        await videoButton.click();
        
        // 短時間待機（動画ページ読み込み確認）
        await page.waitForTimeout(CONFIG.videoPageWaitTime);
        
        this.logger.success(`動画ページアクセス完了`, id);
      } else {
        this.logger.info(`動画ボタンが見つかりませんでした（ログインのみ完了）`, id);
      }

      this.successCount++;
      
      // ランダムな待機時間
      const waitTime = this.getRandomWaitTime();
      await page.waitForTimeout(waitTime);

    } catch (error) {
      this.logger.error(`サイトチェック失敗`, id, error);
      this.failCount++;
      
      // エラー時はスクリーンショットを保存（デバッグ用）
      try {
        const screenshotDir = path.join(__dirname, '../logs/screenshots');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        await page.screenshot({ 
          path: path.join(screenshotDir, `error-${id}-${Date.now()}.png`),
          fullPage: true 
        });
      } catch (screenshotError) {
        // スクリーンショット保存失敗は無視
      }
    } finally {
      await context.close();
    }
  }

  // 全サイトを巡回
  async checkAllSites() {
    const sites = this.readSitesFromCSV();
    const totalSites = sites.length;

    this.logger.info(`全${totalSites}サイトの巡回を開始します`);
    this.logger.info('='.repeat(60));

    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];
      const progress = `[${i + 1}/${totalSites}]`;
      
      this.logger.info(`${progress} サイトID: ${site.id} の処理を開始`);
      
      try {
        await this.checkSite(site);
      } catch (error) {
        this.logger.error(`予期しないエラー`, site.id, error);
      }

      // 進捗表示
      if ((i + 1) % 50 === 0) {
        this.logger.info(`進捗: ${i + 1}/${totalSites} サイト完了 (成功: ${this.successCount}, 失敗: ${this.failCount})`);
      }
    }

    this.logger.info('='.repeat(60));
    this.logger.info(`全サイトの巡回が完了しました`);
    this.logger.info(`成功: ${this.successCount} / 失敗: ${this.failCount} / 合計: ${totalSites}`);
  }

  // メイン実行
  async run() {
    try {
      this.logger.info('セミナーサイト巡回チェックを開始します');
      
      await this.initBrowser();
      await this.checkAllSites();
      
      this.logger.printSummary();
      
      // ログをファイルに保存
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.logger.saveToFile(`execution-${timestamp}.json`);
      
    } catch (error) {
      this.logger.error('致命的なエラーが発生しました', null, error);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }
}

// スクリプトとして実行された場合
if (require.main === module) {
  const checker = new SeminarChecker();
  checker.run()
    .then(() => {
      console.log('\n処理が正常に完了しました');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n処理中にエラーが発生しました:', error);
      process.exit(1);
    });
}

module.exports = SeminarChecker;
