###
# server-checker : test/fixtures/smtp-tls/server-valid
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
    key: fs.readFileSync('service-checker/test/fixtures/smtp-tls/certs/valid.key')
    cert: fs.readFileSync('service-checker/test/fixtures/smtp-tls/certs/valid.cert')

  start: (port, callback) ->
    client.listen port, 'localhost', callback
  stop: (callback) ->
    if !_.isFunction(callback)
      callback = _.noop
    client.close callback
