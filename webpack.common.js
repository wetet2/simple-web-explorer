const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
   entry: {
      main: './client/main.js',
      login: './client/login/login.js',
   },

   output: {
      path: __dirname + '/client_dist',
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name]_bundle.js',
   },

   // optimization: {
   //    splitChunks: {
   //       chunks: 'all',
   //    },
   // },

   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            include: [path.resolve(__dirname, 'client')],
            exclude: [/node_modules/, path.resolve(__dirname, 'client_dist')],
            use: [
               {
                  loader: 'babel-loader',
                  options: {
                     "presets": ["@babel/preset-env", "@babel/preset-react"],
                     "plugins": [
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-proposal-class-properties"
                     ]
                  }
               }
            ]
         },
         {
            test: /\.css$/,
            use: [
               MiniCssExtractPlugin.loader,
               'css-loader'
            ]
         },
         {
            test: /\.scss$/,
            use: [
               MiniCssExtractPlugin.loader,
               'css-loader',
               'sass-loader'
            ]
         },
         {
            test: /\.(ttf|eot|woff|woff2|otf)$/,
            use: ['file-loader']
         },

      ]
   },

   plugins: [
      new MiniCssExtractPlugin({
         filename: "[name].css",
         chunkFilename: "[name]_bundle.css",
         // chunks: [],
      }),
      new OptimizeCssAssetsPlugin({
         assetNameRegExp: /\.css$/g,
         cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
         },
      }),

   ],


};
