// Generated by CoffeeScript 1.10.0

/**
 * server-checker : lib/checkers/smtp
 * Author: MrKMG (https://github.com/mrkmg)
 * Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
 *
 * MIT License
 */

(function() {
  var Promise, _, makeRequest, net_node, rawTcp, runRequest;

  Promise = require('bluebird');

  net_node = require('net');

  _ = require('underscore');

  rawTcp = function(options) {
    return Promise.resolve(options).then(makeRequest).then(function(net_client) {
      return runRequest(options, net_client)["catch"](_.identity);
    });
  };

  makeRequest = function(options) {
    _.defaults(options, {
      host: 'localhost',
      timeout: 5000
    });
    if (!_.has(options, 'port')) {
      throw new Error('Port must be defined');
    }
    return net_node.connect(_.pick(options, ['host', 'port']));
  };

  runRequest = function(options, net_client) {
    return new Promise(function(resolve, reject) {
      var cancelEvent, cleanupRequest, doTimeout, request_timeout;
      cancelEvent = function(event_name) {
        net_client.removeAllListeners(event_name);
        return net_client.on(event_name, _.noop);
      };
      cleanupRequest = function() {
        clearTimeout(request_timeout);
        cancelEvent('data');
        cancelEvent('error');
        return net_client.destroy();
      };
      doTimeout = function() {
        var err;
        cleanupRequest();
        err = new Error('Request exceeded timeout of ' + options.timeout + 'ms');
        err.code = 'TIMEOUT';
        return reject(err);
      };
      net_client.on('connect', function() {
        cleanupRequest();
        return resolve();
      });
      net_client.on('error', function(err) {
        cleanupRequest();
        return reject(err);
      });
      return request_timeout = setInterval(doTimeout, options.timeout);
    });
  };

  module.exports = {
    rawTcp: rawTcp
  };

}).call(this);