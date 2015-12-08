// Generated by CoffeeScript 1.10.0

/*
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var CheckResult, Promise, ServiceChecker, _, allowed_properties;

  _ = require('underscore');

  Promise = require('bluebird');

  CheckResult = require('./check-result');

  allowed_properties = ['timeout', 'ca'];

  ServiceChecker = (function() {
    function ServiceChecker(options) {
      if (!_.isObject(options)) {
        options = {};
      }
      _.defaults(options, {
        timeout: 5000,
        ca: null
      });
      if (!_.isNumber(options.timeout)) {
        throw new Error('Timeout must be a number');
      }
      if ((!_.isArray(options.ca)) && (!_.isString(options.ca)) && (!_.isNull(options.ca))) {
        throw new Error('CA must be an array, string, or empty');
      }
      if (_.chain(options).omit(allowed_properties).keys().value().length > 0) {
        throw new Error('Unknown Properties: ' + _.chain(options).omit(allowed_properties).keys().value().join(', '));
      }
      this._options = options;
    }

    ServiceChecker.prototype._makeHandler = function(name, handler) {
      this[name] = function(options) {
        return this._runHandler(name, handler, options);
      };
      return this._loaded.push(name);
    };

    ServiceChecker.prototype._runHandler = function(name, handler, options) {
      var default_options, result;
      default_options = this._options;
      result = void 0;
      return Promise["try"](function() {
        result = new CheckResult(name);
        options = _.defaults(options, default_options);
        return options;
      }).then(handler).then(function(error) {
        return result.finished(error);
      });
    };

    ServiceChecker.prototype.use = function(plugin) {
      var self;
      self = this;
      if (!_.isObject(plugin)) {
        throw new Error('plugin must key:value object');
      }
      _.each(plugin, function(handler, name) {
        if (_.isFunction(handler) && _.isString(name)) {
          return self._makeHandler(name, handler);
        } else {
          throw new Error(name + " does not have a valid handler");
        }
      });
      return this;
    };

    ServiceChecker.prototype._options = {};

    ServiceChecker.prototype._name = 'service-checker';

    ServiceChecker.prototype._loaded = [];

    module.exports = function(options) {
      return new ServiceChecker(options);
    };

    return ServiceChecker;

  })();

}).call(this);
