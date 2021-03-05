import gulp from 'gulp';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';

import del from 'del';
import browserSync from 'browser-sync';

const { src, dest, watch, parallel, series } = gulp;

export const reload = () => {
  browserSync.init({
    server: { baseDir: 'app/' },
    port: 8080,
    notify: false
  })
}

export const scripts = () => {
  return src('app/scripts/*.js')
    .pipe(concat('app.min.js'))
    .pipe(dest('app/scripts'))
    .pipe(browserSync.stream())
}

export const startWatch = () => {
  watch(['app/**/*.js', '!app/**/*.min.js'], scripts);

  watch('app/**/*.scss', styles);

  watch('app/*.html').on('change', browserSync.reload);

  watch('app/images/src/**/*', images);
}

export const styles = () => {
  return src('app/scss/main.scss')
    .pipe(sass())
    .pipe(concat('app.min.css'))
    .pipe(autoprefixer({ grid: true }))
    .pipe(cleancss( { level: { 1: { specialComments: 0 } } }))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream())
}

export const images = () => {
  return src('app/images/src/**/*')
    .pipe(newer('app/images/dest'))
    .pipe(imagemin())
    .pipe(dest('app/images/dest/'))
}

export const cleanimg = () => {
  return del('app/images/dest/**/*', { force: true })
}

export const cleanDist = () => {
  return del('dist/**/*');
}

export const build = () => {
  return src([
    'app/css/**/*.min.css',
    'app/scripts/**/*.min.js',
    'app/images/dest/**/*',
    'app/**/*.html',
  ], { base: 'app' })
    .pipe(dest('dist'));
}

export const buildToDist = series(styles, scripts, images, build);
export default parallel(styles, scripts, reload, startWatch);
