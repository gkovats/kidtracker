const path              = require('path');
const BUILD_DIR         = path.resolve(__dirname, 'public', 'dist');
const APP_DIR           = path.resolve(__dirname, 'src');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractStyles       = new ExtractTextPlugin({
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
        test: /\.scss$/,
        use: extractStyles.extract({
            use: [{
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
      extractStyles
  ]
};
