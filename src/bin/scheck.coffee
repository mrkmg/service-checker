serviceChecker = require('../index')()
args = require('minimist')(process.argv.slice 2)
_ = require 'underscore'

usage = ->
  console.log 'Usage:'
  console.log ''
  console.log 'scheck [type] host [additional_options]'

makeOptions = ->
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

  _.extend host: host, _.omit args, [
    '_',
    'host'
  ]

doCheck = (options) ->
  console.log "Checking #{host} via #{type}."

  serviceChecker[type](options)
  .then (result) ->
    if result.success
      console.log "#{host} is up! Took #{result.time} milliseconds"
    else
      console.log "#{host} is down!"
      console.log ''
      console.log result.error.toString()

run = ->
  console.log 'Service Checker'
  console.log ''

  doCheck makeOptions()

module.exports = run
