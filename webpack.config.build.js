import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {HotModuleReplacementPlugin } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const defaultEnv = {
  dev: false,
  production: true,
};

export default (env = defaultEnv) => ({
  entry: [
    path.join(__dirname, 'src/jsx/index.jsx')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),
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
  devtool: env.dev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
});
