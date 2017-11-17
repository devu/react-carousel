import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {HotModuleReplacementPlugin } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const defaultEnv = {
  dev: true,
  production: false,
};

export default (env = defaultEnv) => ({
  entry: [
    ...[
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
    ],
    path.join(__dirname, 'src/jsx/index.jsx'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    ...[
      new HotModuleReplacementPlugin()
    ],
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.html'),
    })
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
          }
        ]
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['es2015', { modules: false }],
                'react',
              ],
              plugins: ['react-hot-loader/babel'],
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: env.dev ? 'style-loader!css-loader!sass-loader' : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader!sass-loader'
        })
      },
    ]
  },
  devServer: {
    hot: env.dev
  },
  devtool: 'cheap-module-eval-source-map'
});
