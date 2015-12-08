// Generated by CoffeeScript 1.10.0
(function() {
  var Promise, _, doCheck, makeOptions, minimist, run, serviceChecker, usage;

  serviceChecker = require('../index')();

  Promise = require('bluebird');

  minimist = require('minimist');

  _ = require('underscore');

  usage = function() {
    console.log('Usage:');
    console.log('');
    return console.log('scheck [type] host [additional_options]');
  };

  makeOptions = function(args) {
    var host, type;
    if (args._.length === 0) {
      usage();
      throw new Error('Missing host');
    } else if (args._.length === 1) {
      type = 'ping';
      host = args._[0];
    } else if (args._.length === 2) {
      type = args._[0];
      host = args._[1];
    } else {
      usage();
      throw new Error('Too many parameters!!');
    }
    if ((!serviceChecker.hasOwnProperty(type)) || (!_.isFunction(serviceChecker[type]))) {
      usage();
      throw new Error(type + " is not a valid checker");
    }
    return [
      type, host, _.extend({
        host: host
      }, _.omit(args, ['_', 'host']))
    ];
  };

  doCheck = function(type, host, options) {
    console.log("Checking " + host + " via " + type + ".");
    return serviceChecker[type](options).then(function(result) {
      if (result.success) {
        return console.log(host + " is up! Took " + result.time + " milliseconds");
      } else {
        console.log(host + " is down!");
        console.log('');
        return console.log(result.error.toString());
      }
    });
  };

  run = function(args) {
    console.log('Service Checker');
    console.log('');
    return Promise["try"](function() {
      return args.slice(2);
    }).then(minimist).then(makeOptions).spread(doCheck);
  };

  module.exports = run;

}).call(this);
