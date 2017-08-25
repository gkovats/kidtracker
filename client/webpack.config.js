const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BUILD_DIR         = path.resolve(__dirname, 'public', 'dist');
const APP_DIR           = path.resolve(__dirname, 'src');
const extractStyles     = new ExtractTextPlugin({
  filename: "kidtracker.css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: APP_DIR + '/index.js',
  output: {
  filename: 'kidtracker.js',
  path: BUILD_DIR
  },
  module: {
  rules: [
    // Need this for interpreting React JS DOM syntax
    {
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    },
    {
      test: /\.css$/,
      use: extractStyles.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream'
    },
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    },
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml'
    },
    {
      test: /\.scss$/,
      use: extractStyles.extract({
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader",
          options: {
            outputStyle: "compact"
          }
        }],
        // use style-loader in development
        fallback: "style-loader"
      })
    }
  ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    extractStyles
  ]
};
