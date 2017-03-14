const path = require('path')

const webpack = require('webpack')
const { createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps, addPlugins } = require('@webpack-blocks/webpack2');
const devServer = require('@webpack-blocks/dev-server2');
const postcss = require('@webpack-blocks/postcss');
const typescript = require('@webpack-blocks/typescript');
const autoprefixer = require('autoprefixer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const SCRIPTPATH = path.resolve(__dirname)
const PROJPATH = path.dirname(SCRIPTPATH)
const OUTPATH = path.join(PROJPATH, 'build')

module.exports = createConfig([
  entryPoint('./src/'),
  setOutput(path.join('build', 'bundle.js')),
  typescript(),
  postcss([
    autoprefixer({})
  ]),
  addPlugins([
    new HTMLWebpackPlugin({
      template: 'src/index.html',
      title: 'My webpack app'
    }),
    new ProgressBarPlugin(),
  ]),
  env('development', [
    devServer(),
    sourceMaps()
  ]),
  env('production', [
    addPlugins([
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([ ])
    ])
  ])
])
