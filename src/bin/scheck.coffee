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
chalk = require 'chalk'
UsageError = require '../lib/errors/UsageError'
ExitError = require '../lib/errors/ExitError'

printMethods = ->
  console.log chalk.underline 'Methods'

  methods = _.keys(serviceChecker).filter (value) ->
    not (value.substr(0, 1) == '_' or value == 'use')

  console.log '    ' + methods.join ', '

usage = ->
  console.log chalk.bold 'Usage:'
  console.log '    scheck [method] host [additional_options]'
  console.log ''
  printMethods()


makeOptions = (args) ->
  if args.hasOwnProperty 'h'
    throw new UsageError()

  if args._.length == 0
    throw new ExitError 1, 'Missing host'
  else if args._.length == 1
    method = 'ping'
    host = args._[0]
  else if args._.length == 2
    method = args._[0]
    host = args._[1]
  else
    throw new ExitError 1, 'Too many parameters'

  if (not serviceChecker.hasOwnProperty(method)) or (not _.isFunction serviceChecker[method])
    throw new ExitError 1, "#{method} is not a valid method"

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
  console.log "Checking #{host} via #{method}"

  serviceChecker[method](options)
  .then (result) ->
    if result.success
      console.log "#{host} is up"
      console.log "Request took #{result.time} milliseconds"
    else
      console.log "#{host} is down"
      console.log "Request took #{result.time} milliseconds"
      console.log ''
      console.log result.error.toString()
      throw new ExitError 3

run = (args) ->
  Promise
    .try ->
      args.slice 2
    .then minimist
    .then makeOptions
    .spread doCheck
    .catch UsageError,  ->
      usage()
    .catch ExitError, (error) ->
      console.log error.toString()
      process.exit error.code

module.exports = run
