###
server-checker : lib/check-result
Author: MrKMG (https://github.com/mrkmg)
MIT License
###

class CheckResult
  constructor: (@type) ->
    @start_time = Date.now()
    @_hr_start_time = process.hrtime()

  time: -1
  end_time: null
  success: false

  finished: (error) ->
    @_hr_end_time = process.hrtime @_hr_start_time
    @time = Math.round (@_hr_end_time[0] * 1000) + (@_hr_end_time[1] / 1000000)
    @end_time = Date.now()
    if error
      @error = error
    else
      @success = true
    this

module.exports = CheckResult
