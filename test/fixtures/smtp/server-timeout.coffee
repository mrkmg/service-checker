###
# server-checker : test/fixtures/smtp/server-timeout
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

net = require 'net'

module.exports = ->
  client = net.createServer (request, response) ->
    #Do not

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
