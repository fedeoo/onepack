'use strict';

const _ = require('lodash');
const webpack = require('webpack');

module.exports = function(workspace, options) {

  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';
  const lastWorkspace = process.cwd();
  process.chdir(workspace);
  const readConfig = require('../utils/readConfig');
  const packDefaultConfig = require('../config/packDefaultConfig');
  const customConfig = readConfig();
  const packConfig = _.merge({}, packDefaultConfig, customConfig, options);
  const webpackConfig = require('../config/webpack.config.dev')(packConfig);
  process.chdir(lastWorkspace);

  return webpack(webpackConfig);
};
