// Generated by CoffeeScript 1.10.0

/*
 * service-checker
 * Author: MrKMG (https://github.com/mrkmg)
 *
 * MIT License
 */

(function() {
  var CheckResult, DuplicateProviderError, Promise, ServiceChecker, _, allowed_properties;

  _ = require('underscore');

  Promise = require('bluebird');

  CheckResult = require('./CheckResult');

  DuplicateProviderError = require('./errors/DuplicateProviderError');

  allowed_properties = ['timeout', 'ca'];

  ServiceChecker = (function() {
    function ServiceChecker(options) {
      var invalid_properties;
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
      invalid_properties = _.chain(options).omit(allowed_properties).keys().value();
      if (invalid_properties.length > 0) {
        throw new Error('Unknown Properties: ' + invalid_properties.join(', '));
      }
      this._options = options;
    }

    ServiceChecker.prototype._checkForDuplicatePlugin = function(name) {
      return this.hasOwnProperty(name);
    };

    ServiceChecker.prototype._makeHandler = function(name, handler) {
      this[name] = function(options, callback) {
        return this._runHandler(name, handler, options, callback);
      };
      return this._loaded.push(name);
    };

    ServiceChecker.prototype._runHandler = function(name, handler, options, callback) {
      var check_result, default_options, result;
      default_options = this._options;
      result = void 0;
      check_result = Promise["try"](function() {
        result = new CheckResult(name);
        options = _.defaults(options, default_options);
        return options;
      }).then(handler).then(function(error) {
        return result.finished(error);
      });
      if (_.isFunction(callback)) {
        check_result.then(function(result) {
          return callback(null, result);
        })["catch"](function(error) {
          return callback(error);
        });
      }
      return check_result;
    };

    ServiceChecker.prototype.use = function(plugin) {
      var self;
      self = this;
      if (!_.isObject(plugin)) {
        throw new Error('plugin must key:value object');
      }
      _.each(plugin, function(handler, name) {
        if (self._checkForDuplicatePlugin(name)) {
          throw new DuplicateProviderError(name);
        }
      });
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
