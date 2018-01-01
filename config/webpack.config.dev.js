'use strict';

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const helper = require('../utils/webpackHelper');
const paths = require('./paths');
const setRulesAndPlugins = require('./setRulesAndPlugins');

module.exports = function (config) {

  const rules = [];
  let plugins = [
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ];

  setRulesAndPlugins(plugins, rules, config);

  const dllManifest = path.resolve(paths.appBuild, 'vendor-manifest.json');
  const dllJs = path.resolve(paths.appBuild, 'vendor-dll.js');
  if (fs.existsSync(dllManifest) && fs.existsSync(dllJs)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: dllManifest,
        context: paths.appDirectory,
      })
    );
    plugins.push(new AddAssetHtmlPlugin({
      filepath: dllJs,
      includeSourcemap: false,
    }));
  }

  return {
    context: paths.appSrc,
    devtool: 'cheap-eavl-source-map',
    entry: helper.generateEntries(config, false),
    output: {
      path: paths.appBuild,
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: config.output.publicPath,
      crossOriginLoading: 'anonymous',
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
