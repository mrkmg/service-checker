###
# server-checker : test/fixtures/http/server-200
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

http = require 'http'

module.exports = ->
  client = http.createServer (request, response) ->
    response.writeHead 200, 'Content-Type': 'text/plain'
    response.end 'Good'

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
