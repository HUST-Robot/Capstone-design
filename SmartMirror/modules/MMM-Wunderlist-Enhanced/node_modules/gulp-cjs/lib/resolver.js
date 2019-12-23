'use strict';

var path = require('path');
var browserResolve = require('browserify/node_modules/browser-resolve');

module.exports = function (options) {
  var sourceDir = options.sourceDir;
  return function resolve (name, options, callback) {
    var privateName = path.join(sourceDir, name);
    browserResolve(privateName, options, function (err) {
      if (err) {
        browserResolve(name, options, callback);
      } else {
        callback(null, require.resolve(privateName));
      }
    });
  };
};