###*
# server-checker : lib/checkers/smtp
# Author: MrKMG (https://github.com/mrkmg)
# Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
#
# MIT License
###

Promise = require 'bluebird'
smtpConnection = require 'smtp-connection'
_ = require 'underscore'

run = (options, tls) ->
  Promise
  .try ->
    makeRequest options, tls
  .then (request) ->
    runRequest(options, request)
    .catch _.identity

makeRequest = (options, tls) ->
  _.defaults(options,
    host: 'localhost'
    port: 25
    ca: null
    timeout: 5000)

  if !(_.isString(options.host) or !options.host)
    throw new Error('Hostname must be a string or falsey')

  if !(_.isNumber(options.port) or !options.port)
    throw new Error('Port but be a number or falsey')

  if tls
    options.requireTLS = true
    options.ignoreTLS = false
    options.tls = ca: options.ca
  else
    options.requireTLS = false
    options.ignoreTLS = true

  new smtpConnection(_.pick(options, [
    'host'
    'port'
    'tls',
    'requireTLS',
    'ignoreTLS'
  ]))

runRequest = (options, request) ->
  new Promise (resolve, reject) ->
    cancelEvent = (event_name) ->
      request.removeAllListeners event_name
      request.on event_name, _.noop

    cleanupRequest = ->
      clearTimeout request_timeout
      cancelEvent 'data'
      cancelEvent 'error'
      request.close()

    doTimeout = ->
      cleanupRequest()
      err = new Error('Request exceeded timeout of ' + options.timeout + 'ms')
      err.code = 'TIMEOUT'
      reject err

    request.on 'connect', ->
      cleanupRequest()
      resolve()

    request.on 'error', (err) ->
      cleanupRequest()
      reject err

    request_timeout = setInterval(doTimeout, options.timeout)
    request.connect()

module.exports =
  smtp: (options) ->
    run options, false
  smtpTls: (options) ->
    run options, true
