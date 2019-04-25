/**
 * start process in terminal: npx webpack
 */

import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin'
import imageminMozjpeg from 'imagemin-mozjpeg';
import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
import imageminGifsicle from 'imagemin-gifsicle';

module.exports = [
  {
    // mode: 'development',
    context: path.resolve(__dirname, 'src'),

    /**
     * Enable sourcemaps for debugging webpack's output.
     */
    devtool: 'source-map',

    entry: {
      /**
       * JS files
       * {target path} : {base path}
       */
      './js/app.js': './js/app.js',
      './js/bumes.js': './js/bumes.js',
      './js/dog.js': './js/dog.js',

      /**
       * SCSS files
       * {target path} : {base path}
       */
      './css/app.css': './scss/app.scss',
      './css/labamba.css': './scss/labamba.scss'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/js/',
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              rootMode: 'upward',
            },
          }],
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  postcssPresetEnv(),
                  cssnano()
                ]
              }
            }
          ]
        },
        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  postcssPresetEnv(),
                  cssnano()
                ]
              }
            },
            'sass-loader'
          ]
        }
      ],
    },
    optimization: {
      minimizer: [
        /**
         * minify Javascript files
         */
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ],
    },

    plugins: [
      /**
       * prevent webpack from creating a JS file in the CSS output folder
       */
      new FixStyleOnlyEntriesPlugin(),

      new MiniCssExtractPlugin({
        filename: './[name].css',
        chunkFilename: './[id].css',
      }),

      /**
       * use the copy plugin for plain copying files (e.g. vendor files) to the dist folder
       * the files won't be compiled, minified, etc.
       */
      new CopyWebpackPlugin([
        {
          test: /\.(jpeg|png|jpg|gif)$/i,
          context: 'images/',
          from: '**/*',
          to: path.resolve(__dirname, 'dist/images/')
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/i,
          context: 'fonts/',
          from: '**/*',
          to: path.resolve(__dirname, 'dist/fonts/')
        },
        {
          context: 'files/',
          from: '**/*',
          to: path.resolve(__dirname, 'dist/files/')
        },
        {
          from: '../node_modules/acorn/dist/acorn.js',
          to: path.resolve(__dirname, 'dist/js/vendor/')
        }
      ], {

        /**
         * By default, we only copy modified files during
         * a watch or webpack-dev-server build. Setting this
         * to `true` copies all files.
         */
        copyUnmodified: true
      }),

      /**
       * Make sure that the plugin runs after any plugin that adds images (e.g. CopyWebpackPlugin)
       */
      new ImageminPlugin({
        test: /\.(jpeg|png|jpg|gif)$/i,
        context: 'images/',
        pngquant: {
          quality: '75-80'
        },
        plugins: [
          imageminMozjpeg({
            quality: 75,
            progressive: false
          }),
          imageminGifsicle({
            optimizationLevel: 2
          }),
        ]
      })

    ],

    /**
     * Webpack watches for changes
     */
    watch: true
  },
];