// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

// Otherwise modules imported from outside this directory does not compile.
// Also needed if modules from this directory were imported elsewhere
// Seems to be a Babel bug
// https://github.com/babel/babel-loader/issues/149#issuecomment-191991686
const BABEL_CONFIG = {
  presets: [
    'es2015',
    'react',
    'stage-0'
  ].map(function configMap(name) {
    return require.resolve(`babel-preset-${name}`);
  })
};

const config = {
  entry: {
    app: resolve('./src/root.js')
  },

  devtool: 'source-map',

  module: {
    rules: [{
      // Compile ES2015 using bable
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: BABEL_CONFIG
      }]
    }]
  },

  node: {
    fs: 'empty'
  },

  resolve: {
    alias: {
      'react-map-gl': resolve('../../src'),
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./../../modules/mapbox-gl/src'),
      webworkify: 'webworkify-webpack-dropin'
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MapboxAccessToken']),
    new FlowBabelWebpackPlugin()
  ]
};

// Enables bundling against src in this repo rather than the installed version
module.exports = env => env && env.local ?
  require('../webpack.config.local')(config)(env) : config;
