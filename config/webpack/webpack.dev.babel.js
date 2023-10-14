import webpack from "webpack";
import Jarvis from "webpack-jarvis";
import dotenv from "dotenv";
import $ from "jquery";
import paths from "./paths";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const env = dotenv.config().parsed;
const envKeys = Object.keys(env || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "[name].js",
    path: paths.outputPath,
    chunkFilename: "[name].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              removeCR: true,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            },
          },
          {
            loader: "resolve-url-loader",
            options: {
              removeCR: true,
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  performance: {
    hints: "warning",
    maxAssetSize: 20000000,
    maxEntrypointSize: 8500000,
    assetFilter: (assetFilename) => {
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devServer: {
    port: 3000,
    contentBase: paths.outputPath,
    compress: true,
    hot: true,
    historyApiFallback: true,
    // proxy: {
    //   '/storages': {
    //     target: process.env.API_STORAGE,
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   '/api': {
    //     target: process.env.API_URL,
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new Jarvis({
      port: Math.floor(1000 + Math.random() * 9000),
    }),
    new webpack.DefinePlugin(envKeys),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};
