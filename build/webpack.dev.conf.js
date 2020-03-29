"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const merge = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

// 功能 - 引入mock插件
const apiMocker = require("webpack-api-mocker");

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // 使用Mock
    // before(app) {
    //   apiMocker(app, path.resolve("src/server/mock/index.js")
    //   , 
    //   {
        // proxy: {
        //   "/api/": "http://172.16.2.85:8083/"
        // },
    //     changeHost: true
    //   }
    //   );
    // },
    clientLogLevel: "warning",
    historyApiFallback: {
      rewrites: [
        // { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
        {
          from: /\/index/,
          to: path.posix.join(config.dev.assetsPublicPath, "index.html")
        }
      ]
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {
          warnings: false,
          errors: true
        }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxy,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    openPage: "docexchange.html"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin

    // ------------注释掉 配置中的HtmlWebpackPlugin 这个插件---------------------------

    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),

    // ---------------------------------------

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: config.dev.assetsSubDirectory,
        ignore: [".*"]
      }
    ])
    // 添加 utils中我们写的另一个函数utils.htmlPlugin
  ].concat(utils.htmlPlugin())
});

// var pages = utils.getEntries('./src/views/modules/*/*.html')
// for(var page in pages) {
//   // 配置生成的html文件，定义路径等
//   var conf = {
//     filename: page + '.html',
//     template: pages[page], //模板路径
//     inject: true,
//     // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
//     // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
//     // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
//     // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
//     excludeChunks: Object.keys(pages).filter(item => {
//       return (item != page)
//     })
//   }
//   // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
//   devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
// }

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      );

      resolve(devWebpackConfig);
    }
  });
});
