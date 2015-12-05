###
# server-checker : test/fixtures/smtp-tls/server-timeout
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

net = require 'net'

module.exports = ->
  client = net.createServer (request, response) ->
    #Do not reply

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
