var gulp = require('gulp');

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var size = require('gulp-size');
var preprocess = require('gulp-preprocess');

var sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');


gulp.task('styles', function() {
    return sass('./public/css/scss/app.scss', { style: 'expanded', sourcemap: true })
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('default', [], function () {
    preprocess({context: { "NODE_ENV": 'DEVELOPMENT', DEBUG: "*"}}); //To set environment variables in-line
	nodemon({ script: './app.js', ext: 'html js', ignore: ['public/bower_components/**/*.js', 'node_modules/**/*.js', 'public/js'] })
    .on('restart', function () {
      console.log('restarted!');
    });
    //gulp.watch('public/css/scss/**/*.scss', ['css']);
});