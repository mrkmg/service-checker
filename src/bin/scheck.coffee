###
# service-checker : bin/scheck
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

serviceChecker = require('../index')()
Promise = require 'bluebird'
minimist = require 'minimist'
_ = require 'underscore'
require 'colors'

class CanceledError extends Error
  print_usage: false
  constructor: (@print_usage) ->

printMethods = ->
  console.log 'Methods'.underline

  methods = _.keys(serviceChecker).filter (value) ->
    not (value.substr(0, 1) == '_' or value == 'use')

  console.log '    ' + methods.join ', '

usage = ->
  console.log 'Usage:'.bold
  console.log '    scheck [method] host [additional_options]'
  console.log ''
  printMethods()


makeOptions = (args) ->
  if args.hasOwnProperty 'h'
    throw new CanceledError(true)

  if args._.length == 0
    throw new Error 'Missing host'
  else if args._.length == 1
    method = 'ping'
    host = args._[0]
  else if args._.length == 2
    method = args._[0]
    host = args._[1]
  else
    throw new Error 'Too many parameters!!'

  if (not serviceChecker.hasOwnProperty(method)) or (not _.isFunction serviceChecker[method])
    throw new Error "#{method} is not a valid method"

  [
    method,
    host,
    _.extend host: host, _.omit args,
      [
        '_',
        'host'
      ]
  ]

doCheck = (method, host, options) ->
  console.log "Checking #{host} via #{method}."

  serviceChecker[method](options)
  .then (result) ->
    if result.success
      console.log "#{host} is up! Took #{result.time} milliseconds"
    else
      console.log "#{host} is down! Took #{result.time} milliseconds"
      console.log ''
      console.log result.error.toString()

run = (args) ->
  Promise
    .try ->
      args.slice 2
    .then minimist
    .then makeOptions
    .spread doCheck
    .catch CanceledError, (error) ->
      if error.print_usage
        usage()
    .catch (error) ->
      console.log error.toString()

module.exports = run
