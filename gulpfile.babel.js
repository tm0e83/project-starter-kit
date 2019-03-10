const gulp = require ('gulp');
const gulpLoadPlugins = require ('gulp-load-plugins');
const vinylPaths = require ('vinyl-paths');
const del = require ('del');
const deleteEmpty = require ('delete-empty');
// const through = require ('through2');
const browserSync = require ('browser-sync');
// const rename = require ('gulp-rename');
const rollup = require('gulp-better-rollup');
const babel = require ('rollup-plugin-babel');
const uglify = require ('rollup-plugin-babel-minify');
const source = require ('vinyl-source-stream');
const buffer = require ('vinyl-buffer');

const $ = gulpLoadPlugins();

// Options
const useBrowserSync = true;
const devEnvironment = 'local'; // local|zend
const paths = {
  /* Output directory
   * description: The target folder for all processed files. */
  outDir: './dist',

  /* SCSS Imports
   * description: Tells the sass compiler where to find the imported scss files.
   * allowed file types: *.scss
   * outDir: {paths.outDir}/css */
  sassImports: [
    './node_modules/foundation-sites/scss',
    './node_modules/motion-ui/src',
    './node_modules/font-awesome/scss'
  ],

  /* Javascript files
   * usage: {... sourcePath: targetPath, ... }
   * allowed file types: *.js
   * outDir: {paths.outDir}/* */
  js: {
    './src/js/app.js': 'js',
    './src/js/bumes.js': 'js',
    './src/js/**/*.js': 'js',
  },

  /* other files | libs
   * description:
   *   Source and target paths of various file types.
   *   Typically stylesheet and image files are minified.
   *   All other file types are simply copied over to the target folder.
   * usage: {... sourcePath: targetPath, ... }
   * allowed file types: *.*, !*.scss
   * outDir: {paths.outDir}/*, !{paths.outDir}/css
   * DO NOT define {paths.outDir}/css/ as your target directory. Define sub-folder instead, e.g. {paths.outDir}/css/lib */
   copy: {
    // EXAMPLES
    //'./src/files/**/*.pdf': 'files',              // will output in ./dist/files
    //'./src/FOLDERNAME/*.json': 'js/data',         // will output in ./dist/js/data
    //'../test.css': 'css',                         // include source from outside of the project

    // DON'T DO THIS
    //'./src/FOLDERNAME/*.css': 'css',              // will try to ouput in ./dist/css/.
    // don't use dist/css as your output folder!
    // js files
    // './node_modules/jquery/dist/jquery.min.js': 'js/lib',
    // './node_modules/foundation-sites/dist/js/foundation.min.js': 'js/lib',
    './node_modules/@babel/polyfill/dist/polyfill.min.js': 'js/lib',
    // './node_modules/systemjs/dist/s.js': 'js/lib',
    './node_modules/systemjs/dist/system.js': 'js/lib/systemjs',
    './node_modules/systemjs/dist/extras/named-register.min.js': 'js/lib/systemjs',

    // font files
    // './src/fonts/**/*.{ttf,woff,woff2,eof,svg}': 'fonts',
    // './node_modules/font-awesome/fonts/**/*.{ttf,woff,woff2,eof,svg}': 'fonts',

    // image files
    // './src/images/**/*.{png,gif,jpg,jpeg,svg}': 'images'
  }
};

const hasFileExtension = (vinyl, fileExtensions) => {
  return vinyl.path.match(new RegExp('\.(' + fileExtensions.join('|') + ')$')) !== null;
}

// delete empty folders within target folder
const clean = () => deleteEmpty.sync(paths.outDir);

const copy = () => {
  for(let sourcePath in paths.copy) {
    gulp.src(sourcePath)
      .pipe($.watch(sourcePath))
      .pipe($.if((vinyl) => hasFileExtension(vinyl, ['png', 'gif', 'jpg', 'jpeg', 'svg']), $.imagemin()))
      .pipe($.if((vinyl) => hasFileExtension(vinyl, ['css']), $.cleanCss()))
      .pipe($.cleanDest(paths.outDir + '/' + paths.copy[sourcePath]))
      .pipe(gulp.dest(paths.outDir + '/' + paths.copy[sourcePath]));
  }
};

const sass = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe($.watch('./src/scss/**/*.scss', (vinyl) => {

      // delete file in target folder when source file is deleted
      let sassPath = vinyl.path.split('src\\scss\\').pop().replace('\\', '/');
      del(paths.outDir + '/css/' + sassPath.replace(/\.scss$/, '') + '.{css,css.map}');
      scss();
    }));
};

const scss = () => {
  return gulp.src('./src/scss/**/*.scss')

    // delete CSS and MAP file in target folder
    .pipe(vinylPaths((path) => {
      let sassPath = path.split('src\\scss\\').pop().replace('\\', '/');
      return del(paths.outDir + '/css/' + sassPath.replace(/\.scss$/, '') + '.{css,css.map}');
    }))

    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass({ includePaths: paths.sassImports }).on('error', $.sass.logError))
    .pipe($.autoprefixer({ browsers: ['last 2 versions', 'ie >= 11'] }))
    .pipe($.cleanCss())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.outDir + '/css'))
    .pipe($.if(useBrowserSync, browserSync.stream()));
};

const serve = () => {
  if (!useBrowserSync) return;
  let browserSyncOptions;

  switch(devEnvironment) {
    case 'local':
      browserSyncOptions = {
        server: {
          baseDir: './'
        }
      };
      break;
    case 'dev':
      browserSyncOptions = {
        proxy: 'http://www.your-local-dev-environment.com/'
      };
      break;
    default: return;
  }

  browserSync.init(browserSyncOptions);
};

const sync = () => {
  if (!useBrowserSync) return;

  return gulp.src(['./*.{htm,html}', './src/**/*'])
    .pipe($.watch(['./*.{htm,html}', './src/**/*']))
    .pipe($.if(useBrowserSync, browserSync.stream()));
};

const js = () => {
  const cleanDestinationFolder = (src, dest) => {
    return gulp.src(src)
      .pipe($.watch(src), {
        events: ['change']
      })
      .on('unlink', function () {
        let fileName = src.split('/').pop();
        console.log('removing dist/' + dest + '/' + fileName);
        del('dist/' + dest + '/' + fileName);
        console.log('removing dist/' + dest + '/' + fileName + '.map');
        return del('dist/' + dest + '/' + fileName + '.map');
      });
  };

  const createBundle = (src, dest) => {
    return gulp.src(src)
      .on('error', err => { console.log(err.toString()) })
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe(rollup({ plugins: [babel()] }, { format: 'system' }))
      .on('error', err => { console.log(err.toString()) })
      .pipe($.uglify())
      .on('error', err => { console.log(err.toString()) })
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(paths.outDir + '/' + dest))
      .pipe($.if(useBrowserSync, browserSync.stream()));
  };

  Object.keys(paths.js).map((src) => {
    cleanDestinationFolder(src, paths.js[src]);
    gulp.src(src)
      .pipe($.watch(src, vinyl => {
        console.log('PATH:' + vinyl.path.split('src\\js\\').pop().replace('\\', '/'));
        createBundle(src, paths.js[src]);
      }

      ), { events: ['change'] });
      // vinyl.path.split('src\\scss\\').pop().replace('\\', '/');
  });
};


// exports.default = gulp.parallel(
//   copy,
//   sass,
//   js,
//   serve,
//   sync
// );

gulp.task('default', gulp.parallel(copy, sass, js, serve, sync));
