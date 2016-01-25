var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    path = require('path');
    url = require('gulp-css-url-adjuster'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),
    vars = require('postcss-simple-vars'),
    plumber = require('gulp-plumber');

var params = {
  out: 'public',
  htmlSrc: 'index.html',
  levels: ['common.blocks']
};

var getFileNames = require('html2bl').getFileNames(params);

gulp.task('default', ['server', 'build']);

gulp.task('server', function() {
  browserSync.init({
    server: params.out
  });

  gulp.watch('*.html', ['html']);
  gulp.watch(params.levels.map(function(level) {
    var cssGlob = level + '/**/*.css';
    console.log(cssGlob);
    return cssGlob;
  }), ['css']);
});

gulp.task('build', ['html', 'css', 'images']);

gulp.task('html', function() {
  gulp.src(params.htmlSrc)
  .pipe(plumber())
  .pipe(rename('index.html'))
  .pipe(gulp.dest(params.out))
  .pipe(reload({ stream: true }));
});

gulp.task('css', function() {
  getFileNames.then(function(files) {
    console.log(files.css);
    gulp.src(files.css)
    .pipe(plumber())
    .pipe(concat('styles.css'))
    .pipe(url({prepend: 'images/'}))
    .pipe(postcss([ vars ]))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
  })
  .done();
});

gulp.task('images', function() {
  getFileNames.then(function(source) {
    gulp.src(source.dirs.map(function(dir) {
      var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
      console.log(imgGlob);
      return imgGlob;
    }))
    .pipe(gulp.dest(path.join(params.out, 'images')));
  })
  .done();
});
