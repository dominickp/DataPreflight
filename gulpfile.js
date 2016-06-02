var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');


var browserify = require('browserify');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var through = require('through2');
var globby = require('globby');
var reactify = require('reactify');
var collapse = require('bundle-collapser/plugin');

// var uglify = require('gulp-uglify');

// *******************************************


gulp.task('build', function(){
    // gulp expects tasks to return a stream, so we create one here.
    var bundledStream = through();

    bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
        .pipe(source('app.js'))
        // the rest of the gulp task, as you would normally write it.
        // here we're copying from the Browserify + Uglify2 recipe.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add gulp plugins to the pipeline here.
        // .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./Switch/Packed/'));

    // "globby" replaces the normal "gulp.src" as Browserify
    // creates it's own readable stream.
    globby(['./src/js/*.js']).then(function(entries) {
        // create the Browserify instance.
        var b = browserify({
            entries: entries,
            debug: true,
            transform: [reactify],
            browserField: false,
            commondir: false,
            builtins: false,
            fullPaths: false,
            insertGlobalVars : {
                process: undefined,
                global: undefined,
                'Buffer.isBuffer': undefined,
                Buffer: undefined
            },
            require: [
                'xlsx',
                'jszip',
                'xlsjs',
                'harb'
            ]

        });

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b
            // .plugin(collapse)
            .bundle()
            .pipe(bundledStream);
    }).catch(function(err) {
        // ensure any errors from globby are handled
        bundledStream.emit('error', err);
    });

    // finally, we return the stream, so gulp knows when this task is done.
    return bundledStream;

});



gulp.task('jshint', function(){
    return gulp.src(['src/**/*.js', 'tests/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jasmine', function () {
    return gulp.src('src/tests/**/*.js')
        // gulp-jasmine works on filepaths so you can't have any plugins before it
        .pipe(jasmine());
});

gulp.task('test', ['jasmine', 'jshint']);

// ***************************************

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['test']);
});

// *******************************************

gulp.task('default', ['test', 'watch']);