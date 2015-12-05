// Generated by CoffeeScript 1.10.0

/*
 * server-checker : test/fixtures/http/server-200
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var http;

  http = require('http');

  module.exports = function() {
    var client;
    client = http.createServer(function(request, response) {
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      return response.end('Good');
    });
    return {
      start: function(port, callback) {
        return client.listen(port, callback);
      },
      stop: function(callback) {
        return client.close(callback);
      }
    };
  };

}).call(this);
