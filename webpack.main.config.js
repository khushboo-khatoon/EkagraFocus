const { rules } = require('./webpack.rules');
const { plugins } = require('./webpack.plugins');

module.exports = {
  target: 'electron-main',
  entry: './src/main/index.ts',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: { rules },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};