/*
 * @Author: your name
 * @Date: 2020-03-18 09:54:47
 * @LastEditTime: 2020-03-29 16:18:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \doc_exchange_front_end\build\webpack.base.conf.js
 */
'use strict'
const path = require('path')
// 引入生成页面插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入webpack
const webpack = require('webpack')

module.exports = {
  // 打包模式
  mode: 'development',  
  entry: {
    // 配置入口文件
    main: ["@babel/polyfill",path.resolve(__dirname, '../src/main.js')]
  },
  output: {
    // 配置打包文件输出的目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的 js 文件名称
    filename: 'js/[name].[hash:8].js',
    // 生成的 chunk 名称
    chunkFilename: 'js/[name].[hash:8].js',
    // 资源引用的路径
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
      
    ]
  },
  devServer: {
    hot: true,
    port: 3000,
    contentBase: './dist',
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
}