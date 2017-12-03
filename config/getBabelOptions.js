'use strict';

const presetsMap = {
  es2015: [require.resolve('babel-preset-es2015'), { modules: false }],
  react: require.resolve('babel-preset-react'),
  stage0: require.resolve('babel-preset-stage-0'),
};
const pluginsMap = {
  decorators: require.resolve('babel-plugin-transform-decorators-legacy'),
}
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
    if(options[name]) {
      babelConfig.presets.push(presetsMap[name]);
    }
  });
  ['decorators'].forEach((name) => {
    if(options[name]) {
      babelConfig.plugins.push(pluginsMap[name]);
    }
  });

  return babelConfig;
};
