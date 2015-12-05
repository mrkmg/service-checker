// Generated by CoffeeScript 1.10.0

/*
 * server-checker : test/fixtures/smtp-tls/server-timeout
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var net;

  net = require('net');

  module.exports = function() {
    var client;
    client = net.createServer(function(request, response) {});
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
