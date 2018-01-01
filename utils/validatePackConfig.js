'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const paths = require('../config/paths');

function isRelativeFileExist(filePath) {
  const realPath = path.resolve(paths.appSrc, filePath);
  return filePath && fs.existsSync(realPath);
}

function hasBabelAndCSSInLoaders(loaders) {
  return loaders && _.isObject(loaders.babel) && _.isObject(loaders.css);
}
module.exports = function validatePackConfig(packConfig) {
  if (!isRelativeFileExist(packConfig.entry)) {
    console.error('Lack of entry config or entry file is not exist!');
    return false;
  }
  if (!isRelativeFileExist(packConfig.plugins.htmlWebpack.template)) {
    console.error('Lack of template config or template file is not exist!');
    return false;
  }

  if (!hasBabelAndCSSInLoaders(packConfig.loaders)) {
    console.error('Loaders lose babel or css config, there must somthing wrong!');
    return false;
  }
  return true;
};
