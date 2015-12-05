'use strict'

###*
# server-checker : test/specs/main/init
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use(require 'chai-as-promised')
assert = chai.assert
serviceChecker = require('../../..')()
serviceCheckerNonInit = require '../../..'

describe 'MAIN: Module Exists', ->
  it "_name should exist and equal 'service-checker'", ->
    assert.equal serviceChecker._name, 'service-checker'

  it 'should throw for bad default initialization', ->
    assert.throws ->
      serviceCheckerNonInit
        nonprop: 'someValue'

  it 'should throw for bad default timeout', ->
    assert.throws ->
      serviceCheckerNonInit
        timeout: 'a'

  it 'should throw for a bad ca', ->
    assert.throws ->
      serviceCheckerNonInit
        ca: true
