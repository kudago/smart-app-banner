var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
// var postcss = require('gulp-postcss');

gulp.task('sass', function() {
    return gulp.src("./sass/index.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(rename('smart-app-banner.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});
gulp.task('watch:sass', function() {
    gulp.watch("./resources/sass/**/*.scss", ['sass']);
});
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: "./test",
            routes: {
                "/dist": "dist"
            }
        }
    });

    gulp.watch("./sass/**/*.scss", ['sass']);
    // gulp.watch("./index.js").on('change', browserSync.reload);

});
gulp.task('default', ['sass', 'watch:sass']);