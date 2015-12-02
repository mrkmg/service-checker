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

describe 'MAIN: Module Exists', ->
  it "_name should exist and equal 'service-checker'", ->
    assert.equal serviceChecker._name, 'service-checker'
