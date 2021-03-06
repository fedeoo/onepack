'use strict';

module.exports = {
  entry: './main.js',
  output: {
    publicPath: '/',
  },
  externals: {
  },
  plugins: {
    commonChunks: [],
    htmlWebpack: {
      template: './index.html',
      filename: 'index.html',
    },
  },
  loaders: {
    babel: {
      presets: { es2015: true, react: true, stage0: true },
      plugins: {
        decorators: false,
        runtime: {
          helper: false,
          polyfill: false,
          regenerator: true,
        },
        import: false,
      },
    },
    css: {
      modules: false,
      postcss: true,
    },
    scss: false,
    less: false,
  },
};
