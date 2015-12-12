###
# server-checker : test/specs/main/promise
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

Promise = require 'bluebird'
chai = require('chai')
chai.use require('chai-as-promised')
assert = chai.assert

ServiceChecker = require('../../../src/index') timeout: 1000

describe 'MAIN: promise interface', ->
  it 'should return a promise', ->
    options =
      host: '127.0.0.1'

    assert.instanceOf ServiceChecker.ping(options), Promise

