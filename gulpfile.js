var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	gutil		= require('gulp-util'),
	jshint		= require('gulp-jshint');	
    concat     	= require('gulp-concat'),
    sourcemaps 	= require('gulp-sourcemaps'),
    newer 		= require('gulp-newer'),
  	imagemin 	= require('gulp-imagemin'),
  	htmlclean	= require('gulp-htmlclean')

	input  = {
      	'sass': 'app/scss/**/*.scss',
      	'javascript': 'app/js/**/*.js',
      	'vendorjs': 'app/js/vendor/**/*.js',
      	'images' : 'app/img/**/*',
      	'html' : 'app/*.html'
    },

    output = {
      	'stylesheets': 'dist/css',
      	'javascript': 'dist/js',
      	'images' : 'dist/img',
      	'html' : 'dist/'
    };


/* run the watch task when gulp is called without arguments */
gulp.task('default', ['watch']);

/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* process & optimisie images */
gulp.task('images', function() {
  return gulp.src(input.images)
    .pipe(newer(output.images))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(output.images));
});

/* processes HTML files */
gulp.task('html', ['images'], function() {
  return gulp.src(input.html)
  	.pipe(htmlclean())
  	.pipe(gulp.dest(output.html));
});

/* compile scss files */
gulp.task('build-css', function() {
  return gulp.src(input.sass)
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.stylesheets));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function() {
  return gulp.src(input.javascript)
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript));
});

/* Watch these files for changes and run the task on update */
gulp.task('watch', function() {
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  gulp.watch(input.sass, ['build-css']);
  gulp.watch(input.images, ['images']);
  gulp.watch(input.html, ['html']);
});