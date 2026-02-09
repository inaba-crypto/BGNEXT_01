const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logs = [];
    this.startTime = new Date();
  }

  info(message, siteId = null) {
    const timestamp = new Date().toISOString();
    const logMessage = siteId 
      ? `[${timestamp}] [INFO] [Site: ${siteId}] ${message}`
      : `[${timestamp}] [INFO] ${message}`;
    
    console.log(logMessage);
    this.logs.push({ timestamp, level: 'INFO', siteId, message });
  }

  error(message, siteId = null, error = null) {
    const timestamp = new Date().toISOString();
    const errorDetail = error ? ` - ${error.message}` : '';
    const logMessage = siteId 
      ? `[${timestamp}] [ERROR] [Site: ${siteId}] ${message}${errorDetail}`
      : `[${timestamp}] [ERROR] ${message}${errorDetail}`;
    
    console.error(logMessage);
    this.logs.push({ timestamp, level: 'ERROR', siteId, message: message + errorDetail });
  }

  success(message, siteId = null) {
    const timestamp = new Date().toISOString();
    const logMessage = siteId 
      ? `[${timestamp}] [SUCCESS] [Site: ${siteId}] ${message}`
      : `[${timestamp}] [SUCCESS] ${message}`;
    
    console.log(logMessage);
    this.logs.push({ timestamp, level: 'SUCCESS', siteId, message });
  }

  getSummary() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    
    const summary = {
      totalLogs: this.logs.length,
      errors: this.logs.filter(log => log.level === 'ERROR').length,
      successes: this.logs.filter(log => log.level === 'SUCCESS').length,
      duration: `${Math.floor(duration / 60)}分${duration % 60}秒`,
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString()
    };

    return summary;
  }

  printSummary() {
    const summary = this.getSummary();
    console.log('\n='.repeat(60));
    console.log('実行サマリー');
    console.log('='.repeat(60));
    console.log(`開始時刻: ${summary.startTime}`);
    console.log(`終了時刻: ${summary.endTime}`);
    console.log(`実行時間: ${summary.duration}`);
    console.log(`総ログ数: ${summary.totalLogs}`);
    console.log(`成功: ${summary.successes}`);
    console.log(`エラー: ${summary.errors}`);
    console.log('='.repeat(60));
  }

  saveToFile(filename = 'execution-log.json') {
    const logDir = path.join(__dirname, '../logs');
    
    // logsディレクトリが存在しない場合は作成
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, filename);
    const logData = {
      summary: this.getSummary(),
      logs: this.logs
    };

    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
    console.log(`\nログファイルを保存しました: ${logFile}`);
  }
}

module.exports = Logger;
