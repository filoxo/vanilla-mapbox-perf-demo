var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({ use: 'css-loader' })
    }]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ]
};