/**
 * start process in terminal: npx webpack
 */

import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import JsDocPlugin from 'jsdoc-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin'
import imageminMozjpeg from 'imagemin-mozjpeg';
import cssnano from 'cssnano';
import imageminGifsicle from 'imagemin-gifsicle';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

/**
* JS entry points
* {target path} : {base path}
* e.g. './js/app': './js/app.js',
* IMPORTANT: Omit target file extension!
*/
const entries = {
  'app': './js/app.js',
}

console.log('### Entries ###');
console.log(Object.values(entries));

module.exports = [{
  mode: 'production',
  target: ['web', 'es5'],

  resolve: {
    alias: {
      'app': path.resolve(__dirname, './'),
    }
  },

  /**
  * Enable sourcemaps for debugging webpack's output.
  */
  devtool: 'source-map',

  /**
  * Webpack watches for changes
  */
  watch: true,

  /**
  * Terminal log settings
  */
  stats: {
    all: false,
    errors: true,
    warnings: false,
  },

  entry: entries,
  context: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: path.resolve(__dirname),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
  },
  module: {
    rules: [{
        test: /\.js$/i,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            rootMode: 'upward',
            cacheDirectory: true
          }
        }],
      },

      {
        test: /\.css$/i,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].css',
              outputPath: '/css'
            }
          },
          {
            loader: MiniCssExtractPlugin.loader
          },
          // 'extract-loader',
          'css-loader',
          'postcss-loader'
        ]
      },

      {
        test: /\.scss$/i,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: false,
                plugins: [
                  [
                    'postcss-preset-env',
                    {},
                  ],
                  cssnano({
                    preset: 'default',
                  })
                ]
              },
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                indentWidth: 2,
                includePaths: ['./node_modules'],
              },
            }
          }
        ]
      },

      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource',
        include: /src\\images/,
        generator: {
          filename: '[path][name][ext]'
        }
      },

      {
        test: /flag-icon-css\\flags\\.*\.svg$/i,
        type: 'asset/resource',
        include: /node_modules/,
        generator: {
          filename: (file) => {
            if (file.filename.match('1x1') !== null) {
              return `images/icons/flags/1x1/[name][ext]`;
            } else {
              return `images/icons/flags/4x3/[name][ext]`;
            }
          }
        }
      },

      {
        test: /@fortawesome\\.*\.(eot|otf|svg|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        include: /node_modules/,
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },

      {
        type: 'asset/resource',
        include: [/src\\files/, /src\\fonts/],
        generator: {
          filename: '[path][name][ext]'
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      // minSize: 30000,
      // maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      // name: true,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    minimize: true,
    minimizer: [
      /**
      * minify Javascript files
      */
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  performance: {
    hints: false
  },

  plugins: [
    new FriendlyErrorsWebpackPlugin(),

    /**
    * use the copy plugin for plain copying files (e.g. vendor files) to the dist folder
    * the files won't be compiled, minified, etc.
    */
    // new CopyWebpackPlugin({
    //   patterns: [
    //     // General
    //     {
    //       from: '../node_modules/sourcemapped-stacktrace/dist/sourcemapped-stacktrace.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/')
    //     },
    //     {
    //       from: '../node_modules/jquery/dist/jquery.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/')
    //     },
    //     {
    //       from: '../node_modules/foundation-sites/dist/js/foundation.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/')
    //     },
    //     {
    //       from: '../node_modules/foundation-sites/dist/js/plugins/foundation.equalizer.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/')
    //     },
    //     {
    //       from: '../node_modules/chart.js/dist/Chart.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib')
    //     },
    //     {
    //       from: '../node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib')
    //     },
    //     {
    //       from: '../node_modules/blazy/blazy.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib')
    //     },

    //     // Webcomponents Loader
    //     {
    //       from: '../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/webcomponentsjs')
    //     },
    //     {
    //       from: '../node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/webcomponentsjs')
    //     },
    //     {
    //       from: '../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/webcomponentsjs')
    //     },
    //     {
    //       context: '../node_modules/@webcomponents/webcomponentsjs/bundles/',
    //       from: '**/*.{js,map}',
    //       to: path.resolve(__dirname, 'dist/js/lib/webcomponentsjs/bundles')
    //     },

    //     // Moment.js
    //     {
    //       from: '../node_modules/moment/min/moment.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/moment/')
    //     },
    //     {
    //       context: '../node_modules/moment/locale/',
    //       from: '*.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/moment/locale/')
    //     },

    //     // Glide Slider
    //     {
    //       from: '../node_modules/cropperjs/dist/cropper.esm.js',
    //       to: path.resolve(__dirname, 'dist/lib/cropperjs/')
    //     },
    //     {
    //       from: '../node_modules/cropperjs/dist/cropper.min.css',
    //       to: path.resolve(__dirname, 'dist/lib/cropperjs/')
    //     },

    //     // noUiSlider - Range Slider
    //     {
    //       from: '../node_modules/nouislider/dist/nouislider.min.css',
    //       to: path.resolve(__dirname, 'dist/lib/nouislider/')
    //     },
    //     {
    //       from: '../node_modules/nouislider/dist/nouislider.min.js',
    //       to: path.resolve(__dirname, 'dist/lib/nouislider/')
    //     },

    //     // (DEPRECATED! use Splide Slider instead!)
    //     // Slick Slider Carousel
    //     {
    //       from: '../node_modules/slick-carousel/slick/slick.min.js',
    //       to: path.resolve(__dirname, 'dist/js/lib/slick/')
    //     },
    //     {
    //       from: '../node_modules/slick-carousel/slick/slick.css',
    //       to: path.resolve(__dirname, 'dist/js/lib/slick/')
    //     },

    //     // Glide Slider
    //     {
    //       from: '../node_modules/@glidejs/glide/dist/glide.min.js',
    //       to: path.resolve(__dirname, 'dist/lib/glide/')
    //     },
    //     {
    //       from: '../node_modules/@glidejs/glide/dist/css/glide.core.min.css',
    //       to: path.resolve(__dirname, 'dist/lib/glide/')
    //     },

    //     // Plyr Media Player
    //     {
    //       from: '../node_modules/plyr/dist/plyr.min.js',
    //       to: path.resolve(__dirname, 'dist/plyr/')
    //     },
    //     {
    //       from: '../node_modules/plyr/dist/plyr.css',
    //       to: path.resolve(__dirname, 'dist/plyr/')
    //     },

    //     // Flatpickr
    //     {
    //       from: '../node_modules/flatpickr/dist/flatpickr.min.js',
    //       to: path.resolve(__dirname, 'dist/flatpickr/')
    //     },
    //     {
    //       from: '../node_modules/flatpickr/dist/flatpickr.min.css',
    //       to: path.resolve(__dirname, 'dist/flatpickr/')
    //     },
    //     {
    //       context: '../node_modules/flatpickr/dist/l10n/',
    //       from: '**/*',
    //       to: path.resolve(__dirname, 'dist/flatpickr/l10n/')
    //     },

    //     // Datatables
    //     {
    //       from: '../node_modules/datatables.net/js/jquery.dataTables.min.js',
    //       to: path.resolve(__dirname, 'dist/datatables/js/')
    //     },
    //     {
    //       from: '../node_modules/datatables.net-dt/css/jquery.dataTables.min.css',
    //       to: path.resolve(__dirname, 'dist/datatables/css/')
    //     },
    //     {
    //       context: '../node_modules/datatables.net-dt/images/',
    //       from: '**/*.{png,gif,jpg,jpeg,svg}',
    //       to: path.resolve(__dirname, 'dist/datatables/images/')
    //     },

    //     // TinyMCE
    //     {
    //       from: '../node_modules/tinymce/tinymce.min.js',
    //       to: path.resolve(__dirname, 'dist/tinymce/')
    //     },
    //     {
    //       context: '../node_modules/tinymce/themes/',
    //       from: '**/*',
    //       to: path.resolve(__dirname, 'dist/tinymce/themes/')
    //     },
    //     {
    //       from: '../node_modules/tinymce/plugins/paste/plugin.min.js',
    //       to: path.resolve(__dirname, 'dist/tinymce/plugins/paste/')
    //     },
    //     {
    //       context: '../node_modules/tinymce-i18n/langs/',
    //       from: '**/*',
    //       to: path.resolve(__dirname, 'dist/tinymce/i18n/')
    //     },
    //     {
    //       context: '../node_modules/tinymce/skins/',
    //       from: '**/*',
    //       to: path.resolve(__dirname, 'dist/tinymce/skins/')
    //     },

    //     // Vis Timeline
    //     {
    //       from: '../node_modules/vis-timeline/dist/vis-timeline-graph2d.min.js',
    //       to: path.resolve(__dirname, 'dist/vis-timeline/')
    //     },
    //     {
    //       from: '../node_modules/vis-timeline/dist/vis-timeline-graph2d.min.css',
    //       to: path.resolve(__dirname, 'dist/vis-timeline/')
    //   }
    //   ],
    //   options: {}
    // }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),

    // new JsDocPlugin({
    //   conf: 'jsdoc.conf.js',
    //   cwd: '.',
    //   preserveTmpFile: false,
    //   recursive: false
    // }),

    /**
    * Make sure that the plugin runs after any plugin that adds images (e.g. CopyWebpackPlugin)
    */
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
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
        })
      ]
    })

  ]
}];