###
# service-checker : lib/errors/UsageError
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

class UsageError extends Error
  message: 'Show The Usage'
  constructor: ->

module.exports = UsageError
