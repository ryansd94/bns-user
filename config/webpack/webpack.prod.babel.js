import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import paths from './paths';
import dotenv from 'dotenv';
import webpack from 'webpack';
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const env = dotenv.config().parsed;
const envKeys = Object.keys(env || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  mode: 'production',
  output: {
    filename: `${paths.jsFolder}/[name].[hash].js`,
    path: paths.outputPath,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
    loader: 'resolve-url-loader',
    options: {
      removeCR: true
    }
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              removeCR: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              removeCR: true,
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(
      {
        output: { path: paths.outputPath },
      },
      {
        root: paths.root,
      },
    ),
    new webpack.DefinePlugin(envKeys),
  ],
};
