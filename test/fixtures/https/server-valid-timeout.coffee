###
# server-checker : test/fixtures/https/server-valid-timeout
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
    #No Response

  start: (port, callback) ->
    client.listen port, callback
  stop: (callback) ->
    client.close callback
