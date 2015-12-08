serviceChecker = require('../index')()
Promise = require 'bluebird'
minimist = require 'minimist'
_ = require 'underscore'

usage = ->
  console.log 'Usage:'
  console.log ''
  console.log 'scheck [type] host [additional_options]'

makeOptions = (args) ->
  if args._.length == 0
    usage()
    throw new Error 'Missing host'
  else if args._.length == 1
    type = 'ping'
    host = args._[0]
  else if args._.length == 2
    type = args._[0]
    host = args._[1]
  else
    usage()
    throw new Error 'Too many parameters!!'

  if (not serviceChecker.hasOwnProperty(type)) or (not _.isFunction serviceChecker[type])
    usage()
    throw new Error "#{type} is not a valid checker"

  [
    type,
    host,
    _.extend host: host, _.omit args,
      [
        '_',
        'host'
      ]
  ]

doCheck = (type, host, options) ->
  console.log "Checking #{host} via #{type}."

  serviceChecker[type](options)
  .then (result) ->
    if result.success
      console.log "#{host} is up! Took #{result.time} milliseconds"
    else
      console.log "#{host} is down!"
      console.log ''
      console.log result.error.toString()

run = (args) ->
  console.log 'Service Checker'
  console.log ''

  Promise
    .try ->
      args.slice 2
    .then minimist
    .then makeOptions
    .spread doCheck

module.exports = run
