const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    path: path.resolve(__dirname, 'hydrate/index.tsx'),
  },

  output: {
    path: path.resolve(__dirname, '../public/static'),
    filename: 'index.js',
  },

  target: 'node',

  // devtool: 'source-map',

  // mode: 'development',

  mode: 'production',

  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
  ],
};
