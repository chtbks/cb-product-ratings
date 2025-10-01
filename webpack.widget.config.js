const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/widget-init.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbooks-ratings-widget.js',
    library: 'ChatbooksRatings',
    libraryTarget: 'umd',
    globalObject: 'this',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    minimize: true
  }
};
