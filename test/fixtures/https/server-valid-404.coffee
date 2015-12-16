###
# server-checker : test/fixtures/https/server-valid-404
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

fs = require 'fs'
https = require 'https'

module.exports = ->
  options =
    key: fs.readFileSync('test/fixtures/https/certs/valid.key')
    cert: fs.readFileSync('test/fixtures/https/certs/valid.cert')

  client = https.createServer options, (request, response) ->
    response.writeHead 404, 'Content-Type': 'text/plain'
    response.end 'Error 404'

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
