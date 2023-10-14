module.exports = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
    },
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /node_modules/,
    loader: "file-loader",
  },
  {
    test: /\.(woff|woff2|otf|ttf)$/,
    exclude: /node_modules/,
    loader: "url-loader?prefix=font/&limit=5000",
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    exclude: /node_modules/,
    loader: "url-loader?limit=10000&mimetype=application/octet-stream",
  },
  {
    test: /\.(jpe?g|png|gif|svg|webp|ico)$/i,
    use: ["url-loader?limit=10000", "img-loader"],
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: "style-loader",
      },
      {
        loader: "css-loader",
      },
    ],
  },
  {
    test: /\.s(a|c)ss$/,
    use: [
      {
        loader: "style-loader",
      },
      {
        loader: "css-loader",
        query: {
          modules: {
            localIdentName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      {
        loader: "sass-loader",
        query: {
          modules: { localIdentName: "[name]__[local]___[hash:base64:5]" },
        },
      },
    ],
  },
  // {
  //   test: /\.jsx$/,
  //   use: {
  //     loader: 'babel-loader',
  //     options: {
  //       cacheDirectory: true,
  //       presets: ['react', 'es2015', 'stage-2'],
  //     },
  //   },
  // },
  // {
  //   test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
  //   use: 'url-loader?limit=10000&mimetype=application/font-woff',
  // },
  // {
  //   test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
  //   use: 'url-loader?limit=10000&mimetype=application/font-woff',
  // },
  // {
  //   test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
  //   use: 'url-loader?limit=10000&mimetype=application/octet-stream',
  // },
  // {
  //   test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
  //   use: 'file-loader',
  // },
  // {
  //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
  //   use: 'url-loader?limit=10000&mimetype=image/svg+xml',
  // },
];
