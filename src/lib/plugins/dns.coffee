###*
# server-checker : lib/checkers/dns
# Author: MrKMG (https://github.com/mrkmg)
# Contributor: Sven Slootweg (joepie91) (http://cryto.net/~joepie91/)
#
# MIT License
###

Promise = require 'bluebird'
dns = require 'native-dns'
_ = require 'underscore'

makeRequest = (options) ->
  _.defaults options,
    host: '127.0.0.1'
    port: 53
    name: 'google.com'
    type: 'A'
    timeout: 5000

  question = dns.Question
    name: options.name
    type: options.type

  dns.Request
    cache: false
    question: question
    timeout: options.timeout
    server:
      address: options.host
      port: options.port


doLookup = (request) ->
  new Promise (resolve, reject) ->
    request.on 'timeout', ->
      error = new Error 'Request Timed Out'
      error.code = 'TIMEOUT'
      reject error

    request.on 'end', ->
      resolve null

    request.send()

run = (options) ->
  Promise
    .resolve options
    .then makeRequest
    .then (request) ->
      doLookup request
        .catch _.identity

module.exports = dns: run
