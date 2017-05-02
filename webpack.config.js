var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' }) }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: './index.html' }]),
    new ExtractTextPlugin('styles.css'),
  ]
};