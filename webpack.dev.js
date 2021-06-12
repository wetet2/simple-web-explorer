const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

common.plugins = [
   new HtmlWebpackPlugin({
      filename: 'main.html',
      template: 'client/main.dev.html',
      chunks: ["main"],
   }),
   new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'client/login/login.dev.html',
      chunks: ["login"],
   })
].concat(common.plugins)

module.exports = merge(common, {
   mode: 'development',
   devtool: 'eval-cheap-module-source-map',
   output: {
      sourceMapFilename: '[name][chunkhash].map'
   },
   stats: {
      hash: false,
      version: false,
      // timings: false,
      assets: false,
      entrypoints: false,
      modules: false,
      errorDetails: false,
      // errors: false,
   },
});


