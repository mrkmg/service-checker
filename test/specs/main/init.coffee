###
# server-checker : test/specs/main/init
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use(require 'chai-as-promised')
assert = chai.assert

serviceChecker = require('../../../src/index') timeout: 1000
serviceCheckerNonInit = require('../../../src/index')

describe 'MAIN: Module Exists', ->
  it "_name should exist and equal 'service-checker'", ->
    assert.equal ServiceChecker._name, 'service-checker'

  it 'should throw for bad default initialization', ->
    assert.throws ->
      ServiceCheckerNonInit
        nonprop: 'someValue'

  it 'should throw for bad default timeout', ->
    assert.throws ->
      ServiceCheckerNonInit
        timeout: 'a'

  it 'should throw for a bad ca', ->
    assert.throws ->
      ServiceCheckerNonInit
        ca: true
