var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

// SASS
gulp.task('sass', function () {
  return gulp.src('dev-css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(concat('screensaver.css'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Concatenate & Minify JS
gulp.task('js', function() {
  return gulp.src('dev-js/**/*.js')
  .pipe(order([
    'dev-js/app.js',
    'dev-js/backbone-viewstate.js',
    'dev-js/Store.js',
    'dev-js/twitter.js',
    'dev-js/youtube.js',
    'dev-js/bolcom.js',
    'dev-js/views/slideshow.js',
    'dev-js/data.js',
    'dev-js/**/*.js'
  ]))
  .pipe(sourcemaps.init())
  .pipe(concat('screensaver.js'))
  .pipe(uglify().on('error', function(e){
      console.log(e);
   }))
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('js'));
});

// default gulp task
gulp.task('default', ['sass', 'js']);

// gulp watch taks
gulp.task('watch', function () {

  browserSync.init({
    server: {
        baseDir: './'
    },
    port: 3000,
    open: false,
    notify: true,
    injectChanges: false
  });

  // Watch HTML and SASS files
  gulp.watch([
      '*.html',
      'dev-css/**/*.scss',
      'dev-js/**/*.js'
    ],
    [
      'default'
    ]
  ).on('change', browserSync.reload);
});
