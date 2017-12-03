'use strict';

const path = require('path');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require("glob");
const paths = require('../config/paths');

function getEntries (entry) {
  return glob.sync(entry, {
    cwd: paths.appSrc,
  });
}

function getChunName (file) {
  return file.replace(/^\.\//, '').replace(/\.[tj]sx?$/, '');
}

/**
 * [generateEntries 查找src下所有的 entry, 生成 entry Map]
 * @return {[Object]}  形如 :
 * {
 * 'pages/data/ListView/entry.js': ['./src/pages/data/ListView/entry.js', 'react-dev-utils/webpackHotDevClient'],
 * }
 */
function generateEntries (config, isProd) {
  const entryFiles = getEntries(config.entry);
  if(entryFiles.length === 0) {
    console.error(`src 目录下 找不到入口文件 ${config.entry}`);
    process.exit(0);
  }
  const entry = {};
  if (config.common && config.common.length > 0) {
    entry.common = config.common;
  }

  return _.reduce(entryFiles, function(entryObj, entryFile) {
    const chunkName = getChunName(entryFile);
    if (isProd) {
      entryObj[chunkName] = [entryFile];
      return entryObj;
    }
    entryObj[chunkName] = [
      require.resolve('./webpackHotDevClient'),
    ].concat(entryFile);
    return entryObj;
  }, entry);
}

function getTemplates(template) {
  return glob.sync(template, {
    cwd: paths.appSrc,
  });
}

function isSamePath(fileA, fileB) {
  return path.dirname(fileA) === path.dirname(fileB);
}

/**
 * [genarateHtmlPlugins 根据入口文件 build htmlplugin数组]
 * @param  {[String]} entryFiles [filePath]
 * @return {[Array]}
 * chunksName 形如： 'pages/data/ListView/entry'
 * htmlPath 形如 'pages/data/ListView/index.html',
 */
function genarateHtmlPlugins(config) {
  const entryFiles = getEntries(config.entry);
  const templates = getTemplates(config.template);
  if(templates.length === 0) {
    console.log(`src 目录下 找不到模板文件 ${config.template}`);
  }
  return _.map(entryFiles, function (entryFile) {
    const chunkName = getChunName(entryFile);
    const chunks = [chunkName];
    if (config.common && config.common.length > 0) {
      chunks.push('common');
    }
    const template = templates.find(item => isSamePath(entryFile, item)) || templates[0];
    const filename = path.join(path.dirname(entryFile), './index.html');
    return new HtmlWebpackPlugin({
      chunks: chunks,
      filename: filename,
      template: template,
    });
  });
}

module.exports = {
  generateEntries: generateEntries,
  genarateHtmlPlugins: genarateHtmlPlugins,
};
