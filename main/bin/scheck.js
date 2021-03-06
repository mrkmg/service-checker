// Generated by CoffeeScript 1.10.0

/*
 * service-checker : bin/scheck
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var ExitError, Promise, ServiceChecker, _, chalk, doCheck, makeOptions, minimist, printMethods, run, usage;

  ServiceChecker = require('../index')();

  Promise = require('bluebird');

  minimist = require('minimist');

  _ = require('underscore');

  chalk = require('chalk');

  ExitError = require('../lib/errors/ExitError');

  printMethods = function() {
    var methods;
    console.log(chalk.underline('Methods'));
    methods = _.keys(ServiceChecker).filter(function(value) {
      return !(value.substr(0, 1) === '_' || value === 'use');
    });
    return console.log('    ' + methods.join(', '));
  };

  usage = function() {
    console.log(chalk.bold('Usage:'));
    console.log('    scheck [method] host [additional_options]');
    console.log('');
    return printMethods();
  };

  makeOptions = function(args) {
    var host, method, simple;
    if (args.hasOwnProperty('h')) {
      usage();
      throw new ExitError(0);
    }
    simple = args.hasOwnProperty('s');
    if (args._.length === 0) {
      throw new ExitError(1, 'Missing host');
    } else if (args._.length === 1) {
      method = 'ping';
      host = args._[0];
    } else if (args._.length === 2) {
      method = args._[0];
      host = args._[1];
    } else {
      throw new ExitError(1, 'Too many parameters');
    }
    if (!((ServiceChecker[method] != null) && _.isFunction(ServiceChecker[method]))) {
      throw new ExitError(1, method + " is not a valid method");
    }
    return [
      method, host, simple, _.extend({
        host: host
      }, _.omit(args, ['_', 'host']))
    ];
  };

  doCheck = function(method, host, simple, options) {
    !simple && console.log("Checking " + host + " via " + method);
    return ServiceChecker[method](options).then(function(result) {
      if (result.success) {
        if (simple) {
          return console.log("Up\t" + result.time);
        } else {
          console.log(host + " is up");
          return console.log("Request took " + result.time + " milliseconds");
        }
      } else {
        if (simple) {
          console.log("Down\t" + result.time);
        } else {
          console.log(host + " is down");
          console.log("Request took " + result.time + " milliseconds");
          console.log('');
          console.log(result.error.toString());
        }
        throw new ExitError(2);
      }
    });
  };

  run = function(args) {
    return Promise["try"](function() {
      return args.slice(2);
    }).then(minimist).then(makeOptions).spread(doCheck)["catch"](ExitError, function(error) {
      if (error.message) {
        console.log(error.toString());
      }
      return process.exit(error.code);
    }).then(function() {
      return process.exit(0);
    });
  };

  module.exports = run;

}).call(this);
