# o-pack

`o-pack` 只是 webpack 的封装：隐藏构建优化的逻辑，暴露更加语义化的配置。

[PS: 最开始在公司统一做的构建工具就支持这些功能与`roadhog`非常相似，这个项目只是原来项目的重写，主要是改变了对配置的组织以及代码的重写。]

## Getting Started

### 安装

```sh
npm i o-pack -g
```

### 使用

本地开发
```
o-pack start
```

打包
```
o-pack build
```

## 配置

默认配置：

```js
{
  entry: './main.js', // 路径相对 `src/` 目录，必须指定
  output: {
    publicPath: '/',
  },
  externals: {
  },
  plugins: {
    commonChunks: [], // 仅支持数组
    htmlWebpack: {
      template: './index.html', // 相对 src
      filename: 'index.html',
    },
  },
  loaders: {
    babel: {
      presets: { es2015: true, react: true, stage0: true },
      plugins: {
        decorators: false,
        import: false, // 可接受配置对象
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
    scss: false,
    less: false
  },
  devServer: {
  }
}
```

### plugins
commonChunks 只支持数组

### loaders
支持：babel css less scss 配置
配置依赖的 loaders，目前支持 babel 和 css   
babel plugins 支持定义配置  
css、less、scss 支持 modules、postcss 配置项

### devServer

保留 webpack 的配置，见[文档](https://webpack.js.org/configuration/dev-server/#devserver)
