###
# service-checker : lib/errors/ExitError
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

### istanbul ignore next ###
class ExitError extends Error
  message: 'Exit Error'
  code: 255
  constructor: (@code, @message) ->

module.exports = ExitError
