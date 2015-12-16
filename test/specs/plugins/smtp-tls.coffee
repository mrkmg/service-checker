###
# server-checker : test/specs/plugins/smtp-tls
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

describe 'PLUGIN: smtp-tls', ->

  server_valid = require('../../fixtures/smtp-tls/server-valid')()
  server_error = require('../../fixtures/smtp-tls/server-error')()
  server_timeout = require('../../fixtures/smtp-tls/server-timeout')()
  server_expired = require('../../fixtures/smtp-tls/server-expired')()

  valid_cert = fs.readFileSync('test/fixtures/smtp-tls/certs/valid.cert')
  expired_cert = fs.readFileSync('test/fixtures/smtp-tls/certs/expired.cert')

  before 'starting up test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.start 10000, callback
      (callback) ->
        server_error.start 10001, callback
      (callback) ->
        server_timeout.start 10002, callback
      (callback) ->
        server_expired.start 10003, callback
    ], done

  after 'closing test servers', (done) ->
    async.parallel [
      (callback) ->
        server_valid.stop callback
      (callback) ->
        server_error.stop callback
      (callback) ->
        server_timeout.stop callback
      (callback) ->
        server_expired.stop callback
    ], done

  it 'should have method', ->
    assert.property ServiceChecker, 'smtpTls'

  it 'should return success:true for valid server', ->
    options =
      host: 'localhost'
      port: 10000
      ca: valid_cert
    assert.eventually.include ServiceChecker.smtpTls(options), success: true

  it 'should return success:false for bad server', ->
    options =
      port: 10001
      ca: valid_cert
    assert.eventually.include ServiceChecker.smtpTls(options), success: false

  it 'should return success:false due to timeout on slow server', ->
    options =
      port: 10002
      ca: valid_cert
    assert.eventually.include ServiceChecker.smtpTls(options), success: false

  it 'should return success:false due to a expired cert', ->
    options =
      port: 10003
      ca: expired_cert
    assert.eventually.include ServiceChecker.smtpTls(options), success: false

  it 'should reject if bad parameter passed', ->
    options = host: true
    assert.isRejected ServiceChecker.smtpTls(options)
