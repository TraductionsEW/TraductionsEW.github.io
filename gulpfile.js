'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    babel = require('babelify'),
    source = require('vinyl-source-stream'),
    cssimport = require('gulp-cssimport'),
    autoprefixer = require('gulp-autoprefixer'),
    merge = require('gulp-merge');


// =========================
// Styles
// =========================

gulp.task('scss', function () {
  gulp.src('stylesheets/site.scss')
    .pipe(cssimport())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('assets/css'));
});


// =========================
// Scripts
// =========================

gulp.task('js', function () {
  var bundler = watchify(
                  browserify(
                    'javascripts/Site.js',
                    { debug: true }
                  ).transform(
                    babel,
                    { presets: "env" }
                  )
                );

  return bundler.bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('site.js'))
    .pipe(gulp.dest('assets'));
});


// =========================
// Watch
// =========================

gulp.task('watch', function () {
  gulp.watch('./stylesheets/**/*.scss', ['scss']);
  gulp.watch('./javascripts/**/*.js', ['js']);
});

gulp.task('default', ['watch']);
