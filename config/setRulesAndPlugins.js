'use strict';

const os = require('os');
const HappyPack = require('happypack');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths');
const getBabelOptions = require('./getBabelOptions');

const isDevMode = () => {
  return process.env.NODE_ENV === 'development';
};

const addBabelConfig = (plugins, rules, babelConfig) => {
  plugins.push(new HappyPack({
    id: 'js',
    threads: os.cpus().length,
    loaders: [{
      loader: 'babel-loader',
      options: getBabelOptions(babelConfig),
    }],
  }));

  rules.push({
    test: /\.jsx?$/,
    use: 'happypack/loader?id=js',
    exclude: /node_modules/,
  });
};

// addCssConfig has side effect to params plugins and rules
const addCssConfig = (plugins, rules, cssConfig) => {
  const cssLoaders = [];
  if (isDevMode()) {
    cssLoaders.push({
      loader: 'style-loader',
    });
  }
  cssLoaders.push({
    loader: 'css-loader',
  });
  if (cssConfig.postcss) {
    cssLoaders.push({
      loader: 'postcss-loader',
      query: {
        config: paths.ownPostCSSConfig,
      },
    });
  }

  plugins.push(new HappyPack({
    id: 'css',
    threads: os.cpus().length,
    loaders: cssLoaders,
  }));

  if (isDevMode()) {
    rules.push({
      test: /\.css$/,
      use: 'happypack/loader?id=css',
    });
  } else {
    rules.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'happypack/loader?id=css',
      }),
    });
  }
};

// addScssConfig has side effect to params plugins and rules
const addScssConfig = (plugins, rules, cssConfig) => {
  const scssLoaders = [];
  if (isDevMode()) {
    scssLoaders.push({
      loader: 'style-loader',
    });
  }
  scssLoaders.push({
    loader: 'css-loader',
    options: {
      modules: !!cssConfig.modules,
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  });
  if (cssConfig.postcss) {
    scssLoaders.push({
      loader: 'postcss-loader',
      query: {
        config: paths.ownPostCSSConfig,
      }
    });
  }
  scssLoaders.push({
    loader: 'sass-loader',
    options: {
      sourceMap: true,
    },
  });

  plugins.push(new HappyPack({
    id: 'scss',
    threads: os.cpus().length,
    loaders: scssLoaders,
  }));

  if (isDevMode()) {
    rules.push({
      test: /\.scss$/,
      use: 'happypack/loader?id=scss',
    });
  } else {
    rules.push({
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'happypack/loader?id=scss',
      }),
    });
  }
};

module.exports = function setRulesAndPlugins(plugins, rules, config) {
  addBabelConfig(plugins, rules, config.loaders.babel);
  addCssConfig(plugins, rules, config.loaders.css);
  if (config.loaders.css.scss) {
    addScssConfig(plugins, rules, config.loaders.css);
  }
  if (config.common && config.common.length > 0) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: ['common'],
    }));
  }
  rules.push({
    exclude: [
      /\.html$/,
      /\.json$/,
      /\.(js|jsx)$/,
      /\.tsx?$/,
      /\.(css|less|scss)$/,
    ],
    loader: 'url-loader',
  });
};
