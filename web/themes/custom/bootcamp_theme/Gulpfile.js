const gulp = require('gulp'),
sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const svgSprite = require('gulp-svg-sprite');
const mode = require('gulp-mode')();
const del = require('del');

// Paths to sources and generated files: SCSS/CSS, JS, SVG.
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'js'
  },
  icons: {
    src: 'icons/**/*.svg',
    dest: 'sprite'
  }
};

// SASS generation options.
// https://www.npmjs.com/package/gulp-sass#render-with-options
const sassOptions = {
  outputStyle: 'compressed',
  indented: true,
  indentType: 'space',
  indentWidth: 2,
  linefeed: 'lf'
};


// SVG sprite configuration.
// https://www.npmjs.com/package/gulp-svg-sprite#more-complex-example
const spriteConfigDev = {
  shape: {
    dimension: { // Set maximum dimensions
      maxWidth: 32,
      maxHeight: 32
    },
    spacing: { // Add padding
      padding: 10
    },
  },
  mode: {
    view: { // Activate the «view» mode
      bust: false,
      render: {
        css: true
      },
      example: true
    }
  }
};
const spriteConfigProd = {
  shape: {
    dimension: { // Set maximum dimensions
      maxWidth: 32,
      maxHeight: 32
    },
    spacing: { // Add padding
      padding: 10
    },
  },
  mode: {
    view: { // Activate the «view» mode
      bust: false,
      render: {
        css: true
      }
    }
  }
};



// JS minify option.
// https://github.com/terser/terser#minify-options
const jsConfig = {

}

// Generate SVG Sprite.
function sprite() {
  return gulp
    .src(paths.icons.src)
    .pipe(mode.development(svgSprite(spriteConfigDev)))
    .pipe(mode.production(svgSprite(spriteConfigProd)))
    .pipe(gulp.dest(paths.icons.dest));
}

// Minify & uglify JS
// Generate sourcemaps to allow edition & debug of original file.
function es() {
  return gulp
    .src(paths.scripts.src)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(terser(jsConfig))
    .pipe(mode.development(sourcemaps.write('./')))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Compile SCSS into CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass(sassOptions)).on('error', sass.logError)
    .pipe(mode.development(sourcemaps.write('./')))
    .pipe(gulp.dest(paths.styles.dest));
}

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, es);
  gulp.watch(paths.icons.src, sprite);
}

function clean() {
  return del([paths.styles.dest, paths.scripts.dest, paths.icons.dest]);
}

const build = gulp.series(clean, styles, es, sprite);
const watcher = gulp.parallel(clean, styles, es, sprite, watch);

gulp.task(watcher);
gulp.task('default', watcher);
gulp.task('build', build);
