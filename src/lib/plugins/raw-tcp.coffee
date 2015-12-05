###*
# server-checker : lib/checkers/smtp
# Author: MrKMG (https://github.com/mrkmg)
# Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
#
# MIT License
###

Promise = require 'bluebird'
net_node = require 'net'
_ = require 'underscore'

rawTcp = (options) ->
  Promise
  .resolve(options)
  .then(makeRequest)
  .then (net_client) ->
    runRequest(options, net_client)
    .catch _.identity

makeRequest = (options) ->
  _.defaults(options,
    host: 'localhost'
    timeout: 5000)

  if !_.has(options, 'port')
    throw new Error('Port must be defined')

  net_node.connect _.pick(options, [
    'host'
    'port'
  ])

runRequest = (options, net_client) ->
  new Promise((resolve, reject) ->
    cancelEvent = (event_name) ->
      net_client.removeAllListeners event_name
      net_client.on event_name, _.noop

    cleanupRequest = ->
      clearTimeout request_timeout
      cancelEvent 'data'
      cancelEvent 'error'
      net_client.destroy()

    doTimeout = ->
      cleanupRequest()
      err = new Error('Request exceeded timeout of ' + options.timeout + 'ms')
      err.code = 'TIMEOUT'
      reject err

    net_client.on 'connect', ->
      cleanupRequest()
      resolve()

    net_client.on 'error', (err) ->
      cleanupRequest()
      reject err

    request_timeout = setInterval(doTimeout, options.timeout)
  )

module.exports = rawTcp: rawTcp
