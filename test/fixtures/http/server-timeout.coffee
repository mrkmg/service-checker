###
# server-checker : test/fixtures/http/server-timeout
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

http = require 'http'

module.exports = ->
  client = http.createServer (request, response) ->
    #Do not reply

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
