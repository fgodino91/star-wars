var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsWebpackPlugin = require('assets-webpack-plugin');
var path = require('path');

module.exports = {

  output: {
    path: path.resolve('./public/build/'),
    filename: '[name]-[chunkhash].js',
    publicPath: '/build/'
  },

  entry: {
    'global': './public/js/global.js',
    'ngMain' : './public/js/ngMain'
  },

  resolve: {
    modules: [
      path.resolve('.'),
      path.resolve('./public'),
      'node_modules'
    ],
    extensions: ['.js'],
    symlinks: false
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')]
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')]
                }
              },
              {
                loader: 'sass-loader'
              }
            ]
          })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: ['file-loader?name=[name]-[hash].[ext]']
      },
      {
        test: /\.(otf|ttf|eot|woff2?)$/,
        use: ['file-loader?name=fonts/[name]-[hash].[ext]']
      },

      {
        test: /\.jsx?$/,
        exclude: [/node_modules\/(?!(autotrack|dom-utils))/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      }
    ]
  },

  plugins: [
    // output webpack-assets.json, which maps outputted files back to the chunk names they're given in the 'entry' section of
    // this config.
    // https://www.npmjs.com/package/assets-webpack-plugin
    new AssetsWebpackPlugin({ filename: 'webpack-assets.json' }),

    // make global.js the parent of all other entry chunks. Modules require()'d in global.js
    // can be require()'d in other chunks and they won't be bundled twice, even though they're separate files.
    // https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
        names: ['global'],
        filename: '[name]-[hash].js'
    }),

    // for each entry chunk, write everything loaded by extractCSS.extract() (see 'module.loaders' section)
    // into its own output file, which will be recorded in webpack-assets.json.  For example,
    // global.js will have a corresponding global.css containing all css require()'d in the global.js file.
    // https://github.com/webpack/extract-text-webpack-plugin
    new ExtractTextPlugin('[name]-[contenthash].css')
  ]
};
