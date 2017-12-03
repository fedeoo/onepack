'use strict';

const fs = require('fs');
const paths = require('../config/paths');

module.exports = function readConfig() {
  let customConfig = {};
  const configPath = paths.resolveApp('pack.config.json');
  try {
    if (fs.existsSync(configPath)) {
      customConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (err) {
    throw new('Failed at parsing pack.config.json');
  }
  return customConfig;
};
