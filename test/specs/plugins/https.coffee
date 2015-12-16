###
# server-checker : test/specs/plugins/https
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

fs = require 'fs'
chai = require 'chai'
chai.use require 'chai-as-promised'
async = require 'async'

ServiceChecker = require('../../../src/index') timeout: 1000

assert = chai.assert

describe 'PLUGIN: https', ->

  server_valid_200 = require('../../fixtures/https/server-valid-200')()
  server_valid_404 = require('../../fixtures/https/server-valid-404')()
  server_valid_timeout = require('../../fixtures/https/server-valid-timeout')()
  server_expired = require('../../fixtures/https/server-expired')()

  valid_cert = fs.readFileSync('test/fixtures/https/certs/valid.cert')
  expired_cert = fs.readFileSync('test/fixtures/https/certs/expired.cert')

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid_200.start 10000, callback
      (callback) ->
        server_valid_404.start 10001, callback
      (callback) ->
        server_valid_timeout.start 10002, callback
      (callback) ->
        server_expired.start 10003, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid_200.stop callback
      (callback) ->
        server_valid_404.stop callback
      (callback) ->
        server_valid_timeout.stop callback
      (callback) ->
        server_expired.stop callback
    ], done

  it 'should have method', ->
    assert.property ServiceChecker, 'https'

  it 'should return success:true for good host', ->
    options =
      port: 10000
      ca: valid_cert
    assert.eventually.include ServiceChecker.https(options), success: true

  it 'should return success:false for self signed cert', ->
    options = port: 10000
    assert.eventually.include ServiceChecker.https(options), success: false

  it 'should return success:false for 404 response', ->
    options =
      port: 10001
      ca: valid_cert
    assert.eventually.include ServiceChecker.https(options), success: false

  it 'should return success:false for slow responding server', ->
    options =
      port: 10002
      ca: valid_cert
    assert.eventually.include ServiceChecker.https(options), success: false

  it 'should return success:false for expired ssl cert', ->
    options =
      port: 10003
      ca: expired_cert
    assert.eventually.include ServiceChecker.https(options), success: false

  it 'should return success:false for invalid Domain', ->
    options = host: 'invalid.domain'
    assert.eventually.include ServiceChecker.https(options), success: false

  it 'should reject if bad parameter passed', ->
    options = host: true
    assert.isRejected ServiceChecker.https(options)
