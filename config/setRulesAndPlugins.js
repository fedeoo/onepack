'use strict';

const os = require('os');
const _ = require('lodash');
const HappyPack = require('happypack');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths');
const helper = require('../utils/webpackHelper');
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
      options: {
        sourceMap: true,
        config: {
          path: paths.ownPostCSSConfig,
        },
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
const addScssConfig = (plugins, rules, scssConfig) => {
  const scssLoaders = [];
  if (isDevMode()) {
    scssLoaders.push({
      loader: 'style-loader',
    });
  }
  scssLoaders.push({
    loader: 'css-loader',
    options: {
      modules: !!scssConfig.modules,
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  });
  if (scssConfig.postcss) {
    scssLoaders.push({
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        config: {
          path: paths.ownPostCSSConfig,
        },
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

// addLessConfig has side effect to params plugins and rules
const addLessConfig = (plugins, rules, lessConfig) => {
  const lessLoaders = [];
  if (isDevMode()) {
    lessLoaders.push({
      loader: 'style-loader',
    });
  }
  lessLoaders.push({
    loader: 'css-loader',
    options: {
      modules: !!lessConfig.modules,
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  });
  if (lessConfig.postcss) {
    lessLoaders.push({
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        config: {
          path: paths.ownPostCSSConfig,
        },
      }
    });
  }
  lessLoaders.push({
    loader: 'less-loader',
    options: {
      sourceMap: true,
    },
  });

  plugins.push(new HappyPack({
    id: 'less',
    threads: os.cpus().length,
    loaders: lessLoaders,
  }));

  if (isDevMode()) {
    rules.push({
      test: /\.less$/,
      use: 'happypack/loader?id=less',
    });
  } else {
    rules.push({
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'happypack/loader?id=less',
      }),
    });
  }
};

module.exports = function setRulesAndPlugins(plugins, rules, config) {
  if (config.plugins.commonChunks && config.plugins.commonChunks.length > 0) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
      name: ['common'],
    }));
  }
  const htmlPlugins = helper.genarateHtmlPlugins(config);
  (htmlPlugins || []).forEach((htmlPlugin) => {
    plugins.push(htmlPlugin);
  });
  const environmentConfig = _.merge({
    NODE_ENV: isDevMode() ? 'development' : 'production',
  }, config.plugins.environment);
  plugins.push(new webpack.EnvironmentPlugin(environmentConfig));
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

  addBabelConfig(plugins, rules, config.loaders.babel);
  addCssConfig(plugins, rules, config.loaders.css);
  if (config.loaders.scss) {
    addScssConfig(plugins, rules, config.loaders.scss);
  }
  if (config.loaders.less) {
    addLessConfig(plugins, rules, config.loaders.less);
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
