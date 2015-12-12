###
# server-checker : test/specs/plugins/http
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use require 'chai-as-promised'
async = require 'async'

ServiceChecker = require('../../../src/index') timeout: 1000

assert = chai.assert

describe 'PLUGIN: http', ->

  server_200 = require('../../fixtures/http/server-200')()
  server_404 = require('../../fixtures/http/server-404')()
  server_timeout = require('../../fixtures/http/server-timeout')()

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_200.start 10000, callback
      (callback) ->
        server_404.start 10001, callback
      (callback) ->
        server_timeout.start 10002, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_200.stop callback
      (callback) ->
        server_404.stop callback
      (callback) ->
        server_timeout.stop callback
    ], done

  it 'should have method', ->
    assert.property ServiceChecker, 'http'

  it 'should return success:true for properly responding server', ->
    options = port: 10000
    assert.eventually.include ServiceChecker.http(options), success: true

  it 'should return success:false for 404 error', ->
    options = port: 10001
    assert.eventually.include ServiceChecker.http(options), success: false

  it 'should return success:false for slow responding server (timeout)', ->
    options = port: 10002
    assert.eventually.include ServiceChecker.http(options), success: false

  it 'should reject if bad parameter passed', ->
    options = host: true
    assert.isRejected ServiceChecker.http(options)
