import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import paths from './paths';
import dotenv from 'dotenv';
import webpack from 'webpack';

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
