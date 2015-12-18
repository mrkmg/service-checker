###*
# server-checker : lib/checkers/http
# Author: MrKMG (https://github.com/mrkmg)
# Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
#
# MIT License
###

Promise = require 'bluebird'
http_node = require 'http'
https_node = require 'https'
_ = require 'underscore'

run = (options, ssl) ->
  Promise
    .try ->
      makeRequest options, ssl
    .then (request) ->
      runRequest(options, request)
      .then(checkResponse)
      .catch _.identity

makeRequest = (options, ssl) ->
  _.defaults options,
    host: 'localhost'
    port: if ssl then 443 else 80
    method: 'GET'
    path: '/'
    strictSSL: false
    rejectUnauthorized: true
    ca: null
    timeout: 5000
    agent: false

  handler = if ssl then https_node else http_node

  handler.request _.pick options,
    'host'
    'port'
    'method'
    'path'
    'strictSSL'
    'rejectUnauthorized'
    'ca'

runRequest = (options, request) ->
  new Promise (resolve, reject) ->
    cancelEvent = (event_name) ->
      request.removeAllListeners event_name
      request.on event_name, _.noop

    cleanupRequest = ->
      clearTimeout request_timeout
      cancelEvent 'response'
      cancelEvent 'error'
      request.destroy()

    doTimeout = ->
      cleanupRequest()
      err = new Error 'Request exceeded timeout of ' + options.timeout + 'ms'
      err.code = 'TIMEOUT'
      reject err

    request.on 'response', (response) ->
      cleanupRequest()
      resolve response

    request.on 'error', (err) ->
      cleanupRequest()
      reject err

    request_timeout = setTimeout doTimeout, options.timeout

    request.end()


checkResponse = (response) ->
  if response.statusCode >= 400
    error = new Error('HTTP Status code in error range: ' + response.statusCode)
    error.code = 'HTTPSTATUSCODE'
    throw error

  null

module.exports =
  http: (options) ->
    run options, false
  https: (options) ->
    run options, true
