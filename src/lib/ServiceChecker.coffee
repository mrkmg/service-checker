###
# service-checker
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

_ = require 'underscore'
Promise = require 'bluebird'
CheckResult = require './CheckResult'
DuplicateProviderError = require './errors/DuplicateProviderError'

allowed_properties = ['timeout', 'ca']

class ServiceChecker
  constructor: (options) ->
    if !_.isObject(options)
      options = {}

    _.defaults options,
      timeout: 5000
      ca: null

    if not _.isNumber options.timeout
      throw new Error 'Timeout must be a number'

    if (not _.isArray options.ca) and (not _.isString options.ca) and (not _.isNull options.ca)
      throw new Error 'CA must be an array, string, or empty'

    invalid_properties = _.chain(options).omit(allowed_properties).keys().value()

    if invalid_properties.length > 0
      throw new Error 'Unknown Properties: ' + invalid_properties.join(', ')

    @_options = options

  _checkForDuplicatePlugin: (name) ->
    return @.hasOwnProperty name

  _makeHandler: (name, handler) ->
    @[name] = (options, callback) ->
      @_runHandler name, handler, options, callback
    @_loaded.push(name)

  _runHandler: (name, handler, options, callback) ->
    default_options = @_options
    result = undefined

    check_result = Promise
      .try ->
        result = new CheckResult(name)
        options = _.defaults options, default_options
        options
      .then handler
      .then (error) ->
        result.finished(error)

    if _.isFunction callback
      check_result
        .then (result) ->
          callback null, result
        .catch (error) ->
          callback error

    check_result

  use: (plugin) ->
    self = this

    if !_.isObject(plugin)
      throw new Error('plugin must key:value object')

    _.each plugin, (handler, name) ->
      if self._checkForDuplicatePlugin name
        throw new DuplicateProviderError name

    _.each plugin, (handler, name) ->
      if _.isFunction(handler) and _.isString(name)
        self._makeHandler name, handler
      else
        throw new Error("#{name} does not have a valid handler")

    this

  _options: {}
  _name: 'service-checker'
  _loaded: []

  module.exports = (options) ->
    new ServiceChecker(options)
