###
# server-checker : test/specs/bin/scheck
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require 'chai'
chai.use(require 'chai-as-promised')
assert = chai.assert

scheck = require '../../../bin/scheck'

describe 'BIN: scheck', ->

  it 'should process one argument correctly', ->
    assert.isFulfilled scheck [
      'path/to/node',
      'path/to/scheck',
      '127.0.0.1'
    ]

  it 'should process two arguments correctly', ->
    assert.isFulfilled scheck [
      'path/to/node',
      'path/to/scheck',
      'ping',
      '127.0.0.1'
    ]

  it 'should reject on no arguments', ->
    assert.isRejected scheck [
      'path/to/node',
      'path/to/scheck'
    ]

  it 'should reject on too many arguments', ->
    assert.isRejected scheck [
      'path/to/node',
      'path/to/scheck',
      'ping',
      'host1',
      'host2'
    ]

  it 'should reject on unknown type', ->
    assert.isRejected scheck [
      'path/to/node',
      'path/to/scheck',
      'non_existant_check',
      'host1'
    ]

    assert.isFulfilled scheck [
      'path/to/node',
      'path/to/scheck',
      'ping',
      '169.254.0.0',
      '--timeout',
      '1000'
    ]
