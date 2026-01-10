// client/webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    port: 3000,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api', '/courses'],
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    ],
    open: true,
  },
};