const path = require('path')

module.exports = {
  entry: {
    portlet: './src/portlet/portlet.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'mdMonitor',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  mode: 'development'
}
