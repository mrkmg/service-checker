###
# service-checker : bin/scheck
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

ServiceChecker = require('../index')()
Promise = require 'bluebird'
minimist = require 'minimist'
_ = require 'underscore'
chalk = require 'chalk'
ExitError = require '../lib/errors/ExitError'

printMethods = ->
  console.log chalk.underline 'Methods'

  methods = _.keys(ServiceChecker).filter (value) ->
    not (value.substr(0, 1) == '_' or value == 'use')

  console.log '    ' + methods.join ', '

usage = ->
  console.log chalk.bold 'Usage:'
  console.log '    scheck [method] host [additional_options]'
  console.log ''
  printMethods()

makeOptions = (args) ->
  if args.hasOwnProperty 'h'
    usage()
    throw new ExitError 0

  simple = args.hasOwnProperty 's'

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

  unless ServiceChecker[method]? and _.isFunction ServiceChecker[method]
    throw new ExitError 1, "#{method} is not a valid method"

  [
    method,
    host,
    simple,
    _.extend
      host: host, _.omit args,
      [
        '_',
        'host'
      ]
  ]

doCheck = (method, host, simple, options) ->
  not simple and console.log "Checking #{host} via #{method}"

  ServiceChecker[method](options)
  .then (result) ->
    if result.success
      if simple
        console.log "Up\t#{result.time}"
      else
        console.log "#{host} is up"
        console.log "Request took #{result.time} milliseconds"
    else
      if simple
        console.log "Down\t#{result.time}"
      else
        console.log "#{host} is down"
        console.log "Request took #{result.time} milliseconds"
        console.log ''
        console.log result.error.toString()
      throw new ExitError 2

run = (args) ->
  Promise
  .try ->
    args.slice 2
  .then minimist
  .then makeOptions
  .spread doCheck
  .catch ExitError, (error) ->
    if error.message
      console.log error.toString()
    process.exit error.code
  .then ->
    process.exit 0

module.exports = run
