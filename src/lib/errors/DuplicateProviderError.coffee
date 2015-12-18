###
# service-checker : lib/errors/ExitError
# Author: MrKMG (https://github.com/mrkmg)
#
# MIT License
###

### istanbul ignore next ###
class DuplicateProviderError extends Error
  message: 'Duplicate Plugin Provider'
  provider: 'other'
  constructor: (@provider) ->
    @message = "#{@provider} is already a registered plugin"

module.exports = DuplicateProviderError
