###
# server-checker : test/fixtures/smtp/server-error
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

SMTPServer = require('smtp-server').SMTPServer
_ = require 'underscore'

module.exports = ->
  client = new SMTPServer
    secure: false
    logger: false
    hideSTARTTLS: true
    onConnect: (session, callback) ->
      callback new Error

  start: (port, callback) ->
    client.listen port, 'localhost', callback
  stop: (callback) ->
    if !_.isFunction(callback)
      callback = _.noop
    client.close callback
