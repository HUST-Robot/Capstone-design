'use strict';

var fs = require('fs');
var st = require('st');
var url = require('url');
var http = require('http');
var path = require('path');

function server (gulp, options) {

  var port = parseInt(process.env.PORT || options.port, 10);
  var baseDir = path.resolve(options.baseDir || path.resolve('.'));
  var files = options.files || [];

  var indexPage = path.resolve(__dirname, '../static/index.html');
  var index = fs.readFileSync(indexPage, {
    'encoding': 'utf8'
  }).replace('{{FILES}}', files.map(function (file) {
    return '<script src="' + file + '"></script>';
  }).join('\n'));

  var staticServer = st({
    'path': baseDir,
    'url': '/',
    'passthrough': true,
    'index': false,
    'cache': false
  });

  function handleRequest (req, resp) {
    staticServer(req, resp, function () {
      var pathname = url.parse(req.url).pathname;
      if (pathname === '/') {
        resp.write(index);
      }
      resp.end();
    });
  }

  return function () {
    var httpServer = http.createServer(handleRequest);
    httpServer.on('listening', function () {
      console.info('server started on http://%s:%s/',
                   'localhost', port);
    });
    httpServer.listen(port);
  };
}

module.exports = server;