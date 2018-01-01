/**
 * The config Demo...
 */

export default {
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
        import: false,
        runtime: {
          helper: false,
          polyfill: false,
          regenerator: true,
        },
      },
    },
    css: {
      modules: false,
      postcss: true,
    },
    scss: {
      modules: true,
      postcss: true,
    },
    less: {
      modules: true,
      postcss: true,
    }
  },
  devServer: {
  }
};
