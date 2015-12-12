###
# server-checker : test/specs/plugins/smtp
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use require 'chai-as-promised'
async = require 'async'

ServiceChecker = require('../../../src/index') timeout: 1000

assert = chai.assert

describe 'PLUGIN: smtp', ->
  server_valid = require('../../fixtures/smtp/server-valid')()
  server_error = require('../../fixtures/smtp/server-error')()
  server_timeout = require('../../fixtures/smtp/server-timeout')()

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.start 10000, callback
      (callback) ->
        server_error.start 10001, callback
      (callback) ->
        server_timeout.start 10002, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.stop callback
      (callback) ->
        server_error.stop callback
      (callback) ->
        server_timeout.stop callback
    ], done

  it 'should have method', ->
    assert.property ServiceChecker, 'smtp'

  it 'should return success:true for valid server', ->
    options =
      host: 'localhost'
      port: 10000
    assert.eventually.include ServiceChecker.smtp(options), success: true

  it 'should return success:false for bad server', ->
    options = port: 10001
    assert.eventually.include ServiceChecker.smtp(options), success: false

  it 'should return success:false due to timeout on slow server', ->
    options = port: 10002
    assert.eventually.include ServiceChecker.smtp(options), success: false

  it 'should reject if bad host parameter passed', ->
    options = host: true
    assert.isRejected ServiceChecker.smtp(options)

  it 'should reject if bad port parameter passed', ->
    options = port: true
    assert.isRejected ServiceChecker.smtp(options)
