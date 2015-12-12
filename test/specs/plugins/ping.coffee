###
# server-checker : test/specs/plugins/ping
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use require 'chai-as-promised'
async = require 'async'

ServiceChecker = require('../../../src/index') timeout: 1000

assert = chai.assert

describe 'PLUGIN: ping', ->
  it 'should have method', ->
    assert.property ServiceChecker, 'ping'

  it 'should return success:true for valid IP Address', ->
    options = host: '127.0.0.1'
    assert.eventually.propertyVal ServiceChecker.ping(options), 'success', true

  it 'should return success:true for valid Domain', ->
    options = host: 'localhost'
    assert.eventually.propertyVal ServiceChecker.ping(options), 'success', true

  it 'should return success:false if host does not response to pings', ->
    options = host: '169.254.0.0'
    assert.eventually.deepPropertyVal ServiceChecker.ping(options), 'error.code', 'TIMEOUT'

  it 'should return success:false for invalid IP Address', ->
    options = host: '127.0.0.256'
    assert.eventually.propertyVal ServiceChecker.ping(options), 'success', false

  it 'should return success:false for invalid Domain', ->
    options = host: 'invalid.domain'
    assert.eventually.propertyVal ServiceChecker.ping(options), 'success', false

  it 'should reject if host is not a string', ->
    options = host: 1
    assert.isRejected ServiceChecker.ping(options)

  it 'should reject if timeout is not a number', ->
    options =
      host: 'localhost'
      timeout: 'ABC'
    assert.isRejected ServiceChecker.ping(options)
