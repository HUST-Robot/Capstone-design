'use strict';

var fs = require('fs');
var path = require('path');
var mold = require('mold-source-map');

module.exports = function (options) {

  var name = options.name;
  var sourceDir = options.sourceDir;
  var mapFilePath = options.mapFilePath;

  return function mapFileUrlComment (sourcemap, callback) {
    var jsRoot = path.resolve(sourceDir, '..');
    sourcemap.sourceRoot('file://');
    var mapper = mold.mapPathRelativeTo(jsRoot);
    sourcemap.mapSources(function (file) {
      return path.join(name, mapper(file));
    });
    sourcemap.file(name);

    // write map file and return a sourceMappingUrl that points to it
    var content = sourcemap.toJSON(2);
    fs.writeFile(mapFilePath, content, 'utf-8', function (err) {
      if (err) {
        throw err;
      }
      callback('//@ sourceMappingURL=' + path.basename(mapFilePath));
    });
  };
};