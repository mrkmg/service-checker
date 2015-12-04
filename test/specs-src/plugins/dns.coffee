###*
# server-checker : test/specs/plugins/dns
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use require 'chai-as-promised'
assert = chai.assert
async = require 'async'
serviceChecker = require('../../..') timeout: 1000

describe 'PLUGIN: dns', ->

  server_valid = require('../../fixtures/dns/valid')()

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.start 10000, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.stop callback
    ], done

  it 'should have method', ->
    assert.property serviceChecker, 'dns'

  it 'should return success:true for valid request', ->
    options =
      host: '127.0.0.1'
      port: 10000
    assert.eventually.include serviceChecker.dns(options), success: true
#
  it 'should return success:false for timeout', ->
    options =
      host: '127.0.0.1'
      port: 10001
    assert.eventually.include serviceChecker.dns(options), success: false
