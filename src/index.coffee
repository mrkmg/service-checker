ServiceChecker = require './lib/ServiceChecker'
http = require './lib/plugins/http'
smtp = require './lib/plugins/smtp'
ping = require './lib/plugins/ping'
rawTcp = require './lib/plugins/raw-tcp'
dns = require './lib/plugins/dns'

module.exports = (options) ->
  instance = ServiceChecker options
  instance
    .use http
    .use smtp
    .use ping
    .use rawTcp
    .use dns
  instance
