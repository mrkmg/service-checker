###
# server-checker : test/fixtures/raw-tcp/server-open
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

net = require 'net'

module.exports = ->
  client = net.createServer (socket) ->
    socket.end 'Hello!'

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
