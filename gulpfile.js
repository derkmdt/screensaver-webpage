const { src, dest, watch, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const order = require("gulp-order");
const cleanCSS = require('gulp-clean-css');

// SASS
function sassBuild(cb) {
  return src('css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('screensaver.css'))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(dest('public/dist/'));
  cb();
};

// Concatenate & Minify JS
function jsBuild(cb) {
  return src('js/**/*.js')
    .pipe(order([
      'js/app.js',
      'js/backbone-viewstate.js',
      'js/Store.js',
      'js/twitter.js',
      'js/youtube.js',
      'js/views/slideshow.js',
      'js/data.js',
      'js/**/*.js'
    ]))
    .pipe(sourcemaps.init())
    .pipe(concat('screensaver.js'))
    .pipe(uglify().on('error', function(e){
        console.log(e);
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(dest('public/dist/'));
  cb();
};

// default gulp task
function defaultTask(cb) {
  watch([
    'css/**/*.scss'
  ], sassBuild);
  watch([
    'public/*.html',
    'js/**/*.js'
  ], jsBuild);
  cb();
};

exports.js = jsBuild;
exports.sass = sassBuild;
exports.build = parallel(sassBuild, jsBuild);
exports.default = defaultTask;