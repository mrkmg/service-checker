###
# server-checker : test/fixtures/http/server-404
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

http = require 'http'

module.exports = ->
  client = http.createServer (request, response) ->
    response.writeHead 404
    response.end 'Bad'

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
