'use strict'

###*
# server-checker : test/fixtures/https/server-expired
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

fs = require 'fs'
https = require 'https'

module.exports = ->
  options =
    key: fs.readFileSync('test/fixtures/https/certs/expired.key')
    cert: fs.readFileSync('test/fixtures/https/certs/expired.cert')

  client = https.createServer options, (request, response) ->
    response.writeHead 200, 'Content-Type': 'text/plain'
    response.end 'Good'

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
