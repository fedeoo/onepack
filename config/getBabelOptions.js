'use strict';

const presetsMap = {
  es2015: [require.resolve('babel-preset-es2015'), { modules: false }],
  react: require.resolve('babel-preset-react'),
  stage0: require.resolve('babel-preset-stage-0'),
};
const pluginsMap = {
  decorators: require.resolve('babel-plugin-transform-decorators-legacy'),
  runtime: require.resolve('babel-plugin-transform-runtime'),
  import: require.resolve('babel-plugin-import'),
};
module.exports = function getBabelOptions(options = {}) {

  const babelConfig = {
    babelrc: false,
    presets: [],
    plugins: [],
  };

  if(process.env.BABEL_ENV === 'development') {
    babelConfig.cacheDirectory = true;
  }

  ['es2015', 'react', 'stage0'].forEach((name) => {
    if(options.presets[name]) {
      babelConfig.presets.push(presetsMap[name]);
    }
  });
  ['decorators', 'runtime', 'import'].forEach((name) => {
    if(options.plugins[name]) {
      if (typeof options.plugins[name] === 'object') {
        babelConfig.plugins.push([pluginsMap[name], options.plugins[name]])
      } else {
        babelConfig.plugins.push(pluginsMap[name]);
      }
    }
  });

  return babelConfig;
};
