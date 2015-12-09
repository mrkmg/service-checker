###
# server-checker : test/specs/plugins/ping
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

os = require('os')
chai = require('chai')
chai.use require('chai-as-promised')
assert = chai.assert
serviceChecker = require('../../..')(timeout: 1000)

describe 'PLUGIN: ping', ->
  it 'should have method', ->
    assert.property serviceChecker, 'ping'

  it 'should return success:true for valid IP Address', ->
    options = host: '127.0.0.1'
    assert.eventually.propertyVal serviceChecker.ping(options), 'success', true

  it 'should return success:true for valid Domain', ->
    options = host: 'localhost'
    assert.eventually.propertyVal serviceChecker.ping(options), 'success', true

  it 'should return success:false if host does not response to pings', ->
    options = host: '169.254.0.0'
    assert.eventually.deepPropertyVal serviceChecker.ping(options), 'error.code', 'TIMEOUT'

  it 'should return success:false for invalid IP Address', ->
    options = host: '127.0.0.256'
    assert.eventually.propertyVal serviceChecker.ping(options), 'success', false

  it 'should return success:false for invalid Domain', ->
    options = host: 'invalid.domain'
    assert.eventually.propertyVal serviceChecker.ping(options), 'success', false

  it 'should reject if host is not a string', ->
    options = host: 1
    assert.isRejected serviceChecker.ping(options)

  it 'should reject if timeout is not a number', ->
    options =
      host: 'localhost'
      timeout: 'ABC'
    assert.isRejected serviceChecker.ping(options)
