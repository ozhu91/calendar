const path = require("path");
const webpack = require('webpack');

module.exports = {
   entry: {
       app: './app.js',
   },
   context: path.resolve(__dirname, "scripts"),
   output: {
       path: path.resolve(__dirname, "build"),
       filename: 'app.js',
       publicPath: '/build/',
   },

   module: {
       rules: [
           {
               test: /\.(js)$/,
               include: path.resolve(__dirname, "scripts"),
               loader: 'babel-loader',
               exclude: /node_modules/,
               options: {
                 presets: ['@babel/env'],
               }
           },
       ],
   },
};