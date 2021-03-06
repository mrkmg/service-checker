// Generated by CoffeeScript 1.10.0

/**
 * server-checker : lib/checkers/ping
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var Promise, _, checkResult, child_process, makeArguments, ping, spawnPing;

  Promise = require('bluebird');

  _ = require('underscore');

  child_process = require('child_process');

  ping = function(options) {
    return Promise.resolve(options).then(makeArguments).then(function(args) {
      return spawnPing(args).then(checkResult)["catch"](_.identity);
    });
  };

  makeArguments = function(options) {
    var args;
    _.defaults(options, {
      host: 'localhost',
      timeout: 5000
    });
    if (!_.isString(options.host)) {
      throw new Error('Host must be a string');
    }
    if (_.isString(options.timeout)) {
      options.timeout = parseInt(options.timeout);
    }
    if (!_.isNumber(options.timeout || _.isNaN(options.timeout))) {
      throw new Error('timeout must be a number');
    }
    args = [options.host];

    /* istanbul ignore if */
    if (/^win/.test(process.platform)) {
      args.push('-n', 1, '-w', options.timeout);
    } else {
      args.push('-c', 1, '-W', Math.ceil(options.timeout / 1000));
    }
    return args;
  };

  spawnPing = function(args) {
    return Promise["try"](function() {
      var pingCommand;
      pingCommand = 'ping';
      return child_process.spawn(pingCommand, args);
    }).then(function(ping_process) {
      return new Promise(function(resolve, reject) {
        ping_process.on('close', resolve);
        return ping_process.on('error', reject);
      });
    });
  };

  checkResult = function(code) {
    var error;
    if (code === 0) {
      return null;
    } else {
      error = new Error('Request timed out');
      error.code = 'TIMEOUT';
      throw error;
    }
  };

  module.exports = {
    ping: ping
  };

}).call(this);
