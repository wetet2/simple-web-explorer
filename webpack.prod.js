const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

common.plugins = [
   new HtmlWebpackPlugin({
      filename: 'main.html',
      template: 'client/main.html',
      chunks: ["main"],
   }),
   new HtmlWebpackPlugin({
      filename: 'login.html',
      template: 'client/login/login.html',
      chunks: ["login"],
   })
].concat(common.plugins)

module.exports = merge(common, {
   mode: 'production',
   optimization: {
      minimizer: [new TerserPlugin({
         cache: true,
         parallel: true,
         extractComments: true,
         terserOptions: {
            compress: true,
            mangle: true,
         },
      })],
   },

   plugins: [
      new CleanWebpackPlugin()
   ]
});