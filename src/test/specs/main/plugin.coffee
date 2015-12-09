###
# server-checker : test/specs/main/plugin
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

chai = require('chai')
chai.use require('chai-as-promised')
assert = chai.assert
serviceChecker = require('../../..')()

describe 'MAIN: plugin system', ->
  it 'should have a use function', ->
    assert.property serviceChecker, 'use'
    assert.isFunction serviceChecker.use

  it 'should throw if plugin is not an object (name: handler)', ->
    assert.throw ->
      serviceChecker.use ''

  it 'should throw if plugin does not have a valid schema', ->
    assert.throw ->
      serviceChecker.use badPlugin: true
