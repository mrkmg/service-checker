###
# service-checker
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

_ = require 'underscore'
Promise = require 'bluebird'
CheckResult = require './check-result'

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

    if _.chain(options).omit(allowed_properties).keys().value().length > 0
      throw new Error 'Unknown Properties: ' + _.chain(options).omit(allowed_properties).keys().value().join(", ")

    @options = options;

  makeHandler: (name, handler) ->
    @[name] = (options) ->
      @runHandler name, handler, options
    @_loaded.push(name)

  runHandler: (name, handler, options) ->
    default_options = @options
    result = undefined

    Promise
      .try ->
        result = new CheckResult(name)
        options = _.defaults options, default_options
        options
      .then handler
      .then (error) ->
        result.finished(error)

  use: (plugin) ->
    self = this

    if !_.isObject(plugin)
      throw new Error('plugin must key:value object')

    _.each plugin, (handler, name) ->
      if _.isFunction(handler) and _.isString(name)
        self.makeHandler name, handler
      else
        throw new Error("#{name} does not have a valid handler")

    this

  options: {}
  _name: 'service-checker'
  _loaded: []

  module.exports = (options) ->
    new ServiceChecker(options)
