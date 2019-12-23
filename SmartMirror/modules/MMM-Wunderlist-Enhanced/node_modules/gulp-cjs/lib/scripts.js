'use strict';

var fs = require('fs');
var path = require('path');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mold = require('mold-source-map');
var filesize = require('filesize');
var colors = require('gulp-streamify/node_modules/gulp-util').colors;

var mapper = require('./mapper');

var uglifier = uglify({
  'beautify': {
    'width': 80,
    'max-line-len': 80
  },
  'mangle': true,
  'outSourceMap': false
});

function scripts (gulp, options) {

  var name = options.name || 'module';
  var sourceDir = path.resolve(options.sourceDir || 'public');
  var destDir = path.resolve(options.destDir || 'dist');

  var entry = path.dirname(sourceDir);

  var mapFileUrlComment = mapper({
    'name': name,
    'sourceDir': sourceDir,
    'mapFilePath': path.resolve(destDir, name + '.map')
  });

  return function (callback) {
    var bundler = browserify({ 'basedir': sourceDir });

    var excludes = options.excludes || [];
    excludes.forEach(function (module) {
      bundler = bundler.exclude(module);
    });

    bundler
      .require(entry, { 'entry': true })
      // dev version with sourcemaps
      .bundle({
        'standalone': name,
        'debug': true
      })
      .pipe(mold.transform(mapFileUrlComment))
      .pipe(source(name + '.js'))
      .pipe(gulp.dest(destDir))
      // minified version
      .pipe(streamify(uglifier))
      .pipe(rename({ 'suffix': '.min' }))
      .pipe(gulp.dest(destDir))
      .on('end', function () {
        var builtFile = path.join(destDir, name);
        var buildSize = fs.statSync(builtFile + '.js').size;
        var minSize = fs.statSync(builtFile + '.min.js').size;
        console.info('%s Uncompressed\t%s\n%s Compressed\t%s',
                colors.green('\u2713'),
                colors.blue(filesize(buildSize, 2, false)),
                colors.green('\u2713'),
                colors.blue(filesize(minSize, 2, false)));
        callback();
      });
  };
}

module.exports = scripts;