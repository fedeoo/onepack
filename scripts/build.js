'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const argv = require('yargs').argv;
const paths = require('../config/paths');
const packDefaultConfig = require('../config/packDefaultConfig');
const readConfig = require('../utils/readConfig');
const validatePackConfig = require('../utils/validatePackConfig');


function readAndmergeConfig() {
  const customConfig = readConfig();
  const packConfig = _.merge({}, packDefaultConfig, customConfig);
  if (!validatePackConfig(packConfig)) {
    console.log(chalk.red('Failed at validate packConfig, run build again after checking your config file.'));
    process.exit(1);
  }
  const webpackConfig = require('../config/webpack.config.prod')(packConfig);
  return webpackConfig;
}

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function build() {
  let compiler;
  const webpackConfig = readAndmergeConfig();
  try {
    compiler = webpack(webpackConfig);
  } catch(err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  compiler.run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      printErrors(
        'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
        stats.compilation.warnings
      );
      process.exit(1);
    }

    const outputOptions =  {
      context: paths.appSrc,
      colors: { level: 2, hasBasic: true, has256: true, has16m: false },
      children: false,
      performance: true,
    };
    if (argv.json) {
      const data = JSON.stringify(stats.toJson(outputOptions), null, 2);
      fs.writeFile(path.join(process.cwd(), './stat.json'), data, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('write build information to file stat.json');
        }
      });
    } else {
      process.stdout.write(stats.toString(outputOptions) + "\n");
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

  });

}

console.log('clear dest directory:', paths.appBuild);
fs.emptyDirSync(paths.appBuild);

build();

if (fs.existsSync(paths.appPublic)) {
  fs.copySync(paths.appPublic, paths.appBuild);
}
