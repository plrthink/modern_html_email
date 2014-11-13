'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  return gulp.src('app/styles/**.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      sourcemap: true
    }))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

gulp.task('html', ['styles'], function () {
  return gulp.src('app/*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
    .pipe(gulp.dest('dist'));
});

gulp.task('uncss', function () {
  return gulp.src('dist/styles/main.css')
    .pipe($.uncss({
      html: ['dist/index.html']
    }))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('premailer', function() {
  return gulp.src('dist/*.html')
    .pipe($.premailer())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  var del = require('del');
  del(['.tmp', 'dist'], function (msg) {
    console.log('Deleted files.');
  });
});

gulp.task('build', ['clean', 'html', 'images', 'extras'], function () {
  gulp.start('uncss');
});

gulp.task('default', ['build'], function () {
  gulp.start('premailer');
});

gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
    .use(require('connect-livereload')({ port: 35729 }))
    .use(connect.static('app'))
    .use(connect.static('.tmp'))
    .use(connect.directory('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
        console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'styles'], function () {
  require('opn')('http://localhost:9000');
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
        directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
        directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect', 'serve'], function () {
  var server = $.livereload();

  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/images/**/*'
  ]).on('change', function (file) {
    server.changed(file.path);
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
