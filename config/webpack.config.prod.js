'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const helper = require('../utils/webpackHelper');
const paths = require('./paths');
const setRulesAndPlugins = require('./setRulesAndPlugins');

module.exports = function (config) {

  const rules = [];
  let plugins = [
    new ExtractTextPlugin('[name].[contenthash:12].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        sourceMap: false,
        compressor: {
          warnings: false,
        },
      },
    }),
  ];
  setRulesAndPlugins(plugins, rules, config);

  const htmlPlugins = helper.genarateHtmlPlugins(config, true);
  plugins = plugins.concat(htmlPlugins);

  return {
    bail: true,
    context: paths.appSrc,
    devtool: false,
    entry: helper.generateEntries(config, true),
    output: {
      path: paths.appBuild,
      filename: '[name].[chunkhash:12].js',
      chunkFilename: '[name].[chunkhash:12].js',
      publicPath: config.publicPath,
      crossOriginLoading: 'anonymous', // lazy loaded script cross origin
    },
    resolve: {
      modules: [
        'node_modules',
        paths.appNodeModules,
        paths.appSrc,
      ],
      extensions: ['.js', '.json', '.jsx'],
    },
    externals: config.externals || {},
    plugins,
    module: {
      rules: rules,
    },
    resolveLoader: { // 注意：构建目录与仓库目录是分离的，需要指明 loader 的位置
      modules: [paths.ownNodeModules],
    },
  };
}
