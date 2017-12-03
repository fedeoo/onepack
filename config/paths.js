'use strict';

const path = require('path');
const fs = require('fs');

function resolveApp(relativePath) {
  const appDirectory = fs.realpathSync(process.cwd());
  return path.resolve(appDirectory, relativePath);
}
function resolveOwn(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

const config = {
  src: 'src',
  build: 'build',
  public: 'public',
};

const paths = {
  resolveApp: resolveApp,
  get appSrc() {
     return resolveApp(config.src);
  },
  get appBuild() {
     return resolveApp(config.build);
  },
  get appPublic() {
     return resolveApp(config.public);
  },
  get appDirectory() {
    return fs.realpathSync(process.cwd());
  },
  appNodeModules: resolveApp('node_modules'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
  ownPostCSSConfig: resolveOwn('postcss.config.js'),
};

module.exports = paths;
