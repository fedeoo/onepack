'use strict';

const paths = require('./paths');

module.exports = {
  disableHostCheck: true,
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.appBuild,
  watchContentBase: true,
  hot: true,
  stats: {
    chunks: false,
    colors: true
  },
  publicPath: '/',
  watchOptions: {
    ignored: /node_modules/,
  },
  proxy: {},
  historyApiFallback: true,
  host: '127.0.0.1',
  port: 8080,
};
