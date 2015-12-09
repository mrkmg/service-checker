// Generated by CoffeeScript 1.10.0

/*
 * service-checker : bin/scheck
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var Promise, UsageError, _, chalk, doCheck, makeOptions, minimist, printMethods, run, serviceChecker, usage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  serviceChecker = require('../index')();

  Promise = require('bluebird');

  minimist = require('minimist');

  _ = require('underscore');

  chalk = require('chalk');

  UsageError = (function(superClass) {
    extend(UsageError, superClass);

    UsageError.prototype.message = 'Show The Usage';

    function UsageError() {}

    return UsageError;

  })(Error);

  printMethods = function() {
    var methods;
    console.log(chalk.underline('Methods'));
    methods = _.keys(serviceChecker).filter(function(value) {
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
    var host, method;
    if (args.hasOwnProperty('h')) {
      throw new UsageError();
    }
    if (args._.length === 0) {
      throw new Error('Missing host');
    } else if (args._.length === 1) {
      method = 'ping';
      host = args._[0];
    } else if (args._.length === 2) {
      method = args._[0];
      host = args._[1];
    } else {
      throw new Error('Too many parameters!!');
    }
    if ((!serviceChecker.hasOwnProperty(method)) || (!_.isFunction(serviceChecker[method]))) {
      throw new Error(method + " is not a valid method");
    }
    return [
      method, host, _.extend({
        host: host
      }, _.omit(args, ['_', 'host']))
    ];
  };

  doCheck = function(method, host, options) {
    console.log("Checking " + host + " via " + method + ".");
    return serviceChecker[method](options).then(function(result) {
      if (result.success) {
        return console.log(host + " is up! Took " + result.time + " milliseconds");
      } else {
        console.log(host + " is down! Took " + result.time + " milliseconds");
        console.log('');
        return console.log(result.error.toString());
      }
    });
  };

  run = function(args) {
    return Promise["try"](function() {
      return args.slice(2);
    }).then(minimist).then(makeOptions).spread(doCheck)["catch"](UsageError, function() {
      return usage();
    })["catch"](function(error) {
      return console.log(error.toString());
    });
  };

  module.exports = run;

}).call(this);