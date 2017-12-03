'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const _ = require('lodash');
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const paths = require('../config/paths');
const devServerConfig = require('../config/devServerConfig');
const packDefaultConfig = require('../config/packDefaultConfig');
const readConfig = require('../utils/readConfig');
const validatePackConfig = require('../utils/validatePackConfig');

let devServer;

function readAndmergeConfig() {
  const customConfig = readConfig();
  const packConfig = _.merge({}, packDefaultConfig, customConfig);

  if (!validatePackConfig(packConfig)) {
    console.log(chalk.red('Failed at validate packConfig, restart server after checking your config file.'));
    process.exit(1);
  }
  const webpackConfig = require('../config/webpack.config.dev')(packConfig);
  const serverConfig = _.merge({}, devServerConfig, customConfig.devServer);

  return {
    webpackConfig,
    serverConfig,
  };
}

function setupCompiler(webpackConfig, serverConfig) {
  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch(err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  let isFirstCompile = true;
  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }
    if (isFirstCompile) {
      console.log(`The app is running at: ${chalk.cyan(`http://${serverConfig.host}:${serverConfig.port}/`)}`);
      isFirstCompile = false;
    }
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach((message) => {
        console.log(message);
        console.log();
      });
    }
  });
  return compiler;
}

function run() {
  const { webpackConfig, serverConfig } = readAndmergeConfig();
  const compiler = setupCompiler(webpackConfig, serverConfig);
  devServer = new WebpackDevServer(compiler, serverConfig);

  devServer.listen(serverConfig.port, serverConfig.port, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.cyan('Starting the development server...'));
  });
}

if (fs.existsSync(paths.appPublic)) {
  fs.copySync(paths.appPublic, paths.appBuild);
}

run();
fs.watch(paths.resolveApp('pack.config.json'), () => {
  if (devServer) {
    devServer.close();
  }
  console.log(chalk.yellow('Restart dev server due to pack.config.json file changed!'));
  run();
});
