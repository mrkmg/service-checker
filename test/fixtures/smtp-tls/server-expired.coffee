###
# server-checker : test/fixtures/smtp-tls/server-expired
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

SMTPServer = require('smtp-server').SMTPServer
_ = require('underscore')
fs = require('fs')

module.exports = ->
  client = new SMTPServer
    secure: false
    logger: false
    hideSTARTTLS: false
    key: fs.readFileSync('test/fixtures/smtp-tls/certs/expired.key')
    cert: fs.readFileSync('test/fixtures/smtp-tls/certs/expired.cert')

  start: (port, callback) ->
    client.listen port, 'localhost', callback
  stop: (callback) ->
    if !_.isFunction(callback)
      callback = _.noop
    client.close callback
