const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './client/index.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    port: 8080,
    historyApiFallback: true,
    publicPath: '/',
    proxy: {
      "/create": {
        target: "http://localhost:3000",
        pathRewrite: {
          "^/create": ""
        },
        secure: false,
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        //allows for import of styles (import css from 'file.css');
      }, {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/preset-env', {
                  'modules': false
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'MAP',
      // Load a custom template (lodash by default see the FAQ for details)
      template: './client/index.html'
    }),
    /*new UglifyJSPlugin({
      test: /\.js(\?.*)?$/i
    }),*/
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = config;