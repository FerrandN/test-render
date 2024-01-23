const fs = require('fs');

class getdbConfig {
  constructor(filePath) {
    this.filePath = filePath;
  }

  getDbConfig() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      const config = JSON.parse(data);
      return config;
    } catch (error) {
      console.error('Error reading database configuration:', error);
      return null;
    }
  }
}

module.exports = getdbConfig;