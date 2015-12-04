###*
# server-checker : lib/checkers/ping
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

Promise = require 'bluebird'
_ = require 'underscore'
child_process = require 'child_process'

ping = (options) ->
  Promise
    .resolve options
    .then makeArguments
    .then (args) ->
      spawnPing args
      .then checkResult
      .catch _.identity

makeArguments = (options) ->
  _.defaults options,
    host: 'localhost'
    timeout: 5000

  if !_.isString options.host
    throw new Error('Host must be a string')

  if _.isString options.timeout
    options.timeout = parseInt options.timeout

  if !_.isNumber options.timeout or _.isNaN options.timeout
    throw new Error('timeout must be a number')

  args = [ options.host ]

  ### istanbul ignore if ###
  if /^win/.test process.platform
    args.push '-n', 1, '-w', options.timeout
  else
    args.push '-c', 1, '-W', Math.ceil options.timeout / 1000

  args

spawnPing = (args) ->
  Promise
  .try ->
    pingCommand = 'ping'
    child_process.spawn pingCommand, args

  .then (ping_process) ->
    new Promise (resolve, reject) ->
      ping_process.on 'close', resolve
      ping_process.on 'error', reject


checkResult = (code) ->
  if code == 0
    return null
  else
    error = new Error 'Request timed out'
    error.code = 'TIMEOUT'
    throw error

module.exports = ping: ping
