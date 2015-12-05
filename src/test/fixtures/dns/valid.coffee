###
# server-checker : test/fixtures/dns/valid
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

dns = require('native-dns')

module.exports = ->
  server = dns.createServer()

  server.on 'request', (request, response) ->
    response.answer.push dns.A(
      name: request.question[0].name
      address: '127.0.0.1'
      ttl: 600)
    response.send()

  start: (port, callback) ->
    server.on 'listening', callback
    server.serve port
  stop: (callback) ->
    server.on 'close', callback
    server.close()
