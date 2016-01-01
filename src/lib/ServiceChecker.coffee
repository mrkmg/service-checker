###
# service-checker
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

_ = require 'underscore'
Promise = require 'bluebird'
PromiseWhile = (require './components/PromiseWhile') Promise
CheckResult = require './components/CheckResult'
DuplicateProviderError = require './errors/DuplicateProviderError'

allowed_properties = ['timeout', 'ca', 'retries']
defaults =
  timeout: 5000
  retries: 0
  ca: null

class ServiceChecker
  constructor: (options) ->
    if !_.isObject(options)
      options = {}

    _.defaults options, defaults

    if not _.isNumber options.timeout
      throw new Error 'Timeout must be a number'

    if not _.isNumber options.retries
      throw new Error 'Retries must be a number'

    if (not _.isArray options.ca) and (not _.isString options.ca) and (not _.isNull options.ca)
      throw new Error 'CA must be an array, string, or empty'

    invalid_properties = _.chain(options).omit(allowed_properties).keys().value()

    if invalid_properties.length > 0
      throw new Error 'Unknown Properties: ' + invalid_properties.join(', ')

    @_options = options

  _makeHandler: (name, handler) ->
    @[name] = (options, callback) ->
      @_runHandler name, handler, options, callback
    @_loaded.push(name)

  _runHandler: (name, handler, options, callback) ->
    if options is undefined then options = {}
    default_options = @_options
    result = undefined

    check_result = Promise
      .try ->
        result = new CheckResult(name)
        _.defaults options, default_options
      .then (options) ->
        run_count = 0
        last_result = undefined

        test = ->
          (++run_count <= options.retries) and !!last_result

        run = ->
          Promise
            .resolve options
            .then handler
            .then (result) ->
              last_result = result

        PromiseWhile test, run
          .then ->
            last_result
      .then (error) ->
        result.finished error

    if _.isFunction callback
      check_result
        .then (result) ->
          callback null, result
        .catch (error) ->
          callback error

    check_result

  use: (plugin) ->
    self = this

    unless _.isObject plugin
      throw new Error 'plugin must key:value object'

    _.each plugin, (handler, name) ->
      if self.hasOwnProperty name
        throw new DuplicateProviderError name

    _.each plugin, (handler, name) ->
      if _.isFunction(handler) and _.isString(name)
        self._makeHandler name, handler
      else
        throw new Error "#{name} does not have a valid handler"

    this

  _options: {}
  _name: 'service-checker'
  _loaded: []

  module.exports = (options) ->
    new ServiceChecker(options)
