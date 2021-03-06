// Generated by CoffeeScript 1.10.0

/**
 * server-checker : lib/checkers/dns
 * Author: MrKMG (https://github.com/mrkmg)
 * Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
 *
 * MIT License
 */

(function() {
  var Promise, _, dns, doLookup, makeRequest, run;

  Promise = require('bluebird');

  dns = require('native-dns');

  _ = require('underscore');

  makeRequest = function(options) {
    var question;
    _.defaults(options, {
      host: '127.0.0.1',
      port: 53,
      name: 'google.com',
      type: 'A',
      timeout: 5000
    });
    question = dns.Question({
      name: options.name,
      type: options.type
    });
    return dns.Request({
      cache: false,
      question: question,
      timeout: options.timeout,
      server: {
        address: options.host,
        port: options.port
      }
    });
  };

  doLookup = function(request) {
    return new Promise(function(resolve, reject) {
      request.on('timeout', function() {
        var error;
        error = new Error('Request Timed Out');
        error.code = 'TIMEOUT';
        return reject(error);
      });
      request.on('end', function() {
        return resolve(null);
      });
      return request.send();
    });
  };

  run = function(options) {
    return Promise.resolve(options).then(makeRequest).then(function(request) {
      return doLookup(request)["catch"](_.identity);
    });
  };

  module.exports = {
    dns: run
  };

}).call(this);
