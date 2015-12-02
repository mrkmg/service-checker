serviceChecker = require './lib/service-checker'
http = require './lib/plugins/http'
smtp = require './lib/plugins/smtp'
ping = require './lib/plugins/ping'
rawTcp = require './lib/plugins/raw-tcp'

module.exports = (options) ->
  instance = serviceChecker(options)
  instance.use http
  instance.use smtp
  instance.use ping
  instance.use rawTcp
  instance
