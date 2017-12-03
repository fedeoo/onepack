# onepack

`onepack` 是针对 onebox 应用的 CLI 工具。onebox 的应用场景决定 onepack 只处理通用的场景，部分特性暂时还是做了保留。

## Getting Started

### 安装

```sh
tnpm i onepack -g
```

### 使用

本地开发
```
onepack start
```

打包
```
onepack build
```

## 配置

onepack 的配置文件在项目根目录下的 `pack.config.json`，只支持 `JSON` 格式是为了便于约束规范使用方式，也便于统一的升级兼容。
开发环境下服务启动后会监视 `pack.config.json` 文件变化，当文件发生变更时，重新启动编译。

默认配置：

```js
{
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
  devServer: {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appBuild,
    watchContentBase: true,
    hot: true,
    stats: {
      chunks: false,
      colors: true
    },
    publicPath: '/',
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: {},
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8080,
  }
}
```

### entry
项目入口文件，路径相对 `src/` 目录，必须指定

### template
项目模板文件，路径相对 `src/` 目录，必须指定

### filename
项目构建的 html 文件

### common
webpack 构建时 commonChunks 指定的公共模块

### publicPath
开发环境为 `/`，生产环境会替换为项目的 CDN 路径前缀

### externals
外部模块

### loaders
配置依赖的 loaders，目前支持 babel 和 css   
babel 支持选项：es2015、react、stage0、decorators   
css 支持选项：scss、less、postcss、modules   

### devServer

保留 webpack 的配置，见[文档](https://webpack.js.org/configuration/dev-server/#devserver)
