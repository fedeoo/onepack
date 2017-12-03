'use strict';

module.exports = {
  entry: './main.js',
  template: './index.html',
  filename: 'index.html',
  common: [],
  publicPath: '/',
  externals: {
  },
  loaders: {
    babel: { es2015: true, react: true, stage0: true, decorators: true },
    css: { modules: false, scss: false, less: false, postcss: false },
  },
};
