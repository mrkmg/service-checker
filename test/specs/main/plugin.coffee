###
# server-checker : test/specs/main/plugin
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require('chai')
chai.use require('chai-as-promised')
assert = chai.assert

ServiceChecker = require('../../../src/index') timeout: 1000

describe 'MAIN: plugin system', ->
  it 'should have a use function', ->
    assert.property ServiceChecker, 'use'
    assert.isFunction ServiceChecker.use

  it 'should throw if plugin is not an object (name: handler)', ->
    assert.throw ->
      ServiceChecker.use ''

  it 'should throw if plugin does not have a valid schema', ->
    assert.throw ->
      ServiceChecker.use badPlugin: true

  it 'should throw if a plugin with a duplicate name is used', ->
    assert.throw ->
      ServiceChecker.use http: ->
