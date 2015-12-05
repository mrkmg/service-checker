// Generated by CoffeeScript 1.10.0
(function() {
  'use strict';

  /**
   * server-checker : test/fixtures/https/server-expired
   * Author: MrKMG (https://github.com/mrkmg)
   *
   * MIT License
   */
  var fs, https;

  fs = require('fs');

  https = require('https');

  module.exports = function() {
    var client, options;
    options = {
      key: fs.readFileSync('service-checker/test/fixtures/https/certs/expired.key'),
      cert: fs.readFileSync('service-checker/test/fixtures/https/certs/expired.cert')
    };
    client = https.createServer(options, function(request, response) {
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
