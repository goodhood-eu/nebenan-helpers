moment = require('moment')

formatNumber = (number, digits = 2) ->
  padding = "#{Math.pow(10, digits)}".slice(1)
  numberString = "#{number}"

  if numberString.length < digits
    numberString = "#{padding}#{numberString}"
    numberString.slice(numberString.length - digits)
  else
    numberString.slice(0, digits)

# Formats date to YMD instead of Date to avoid timezone issues
formatDate = (string) ->
  return null unless string
  moment(string, 'L').format('YYYY-MM-DD')

formatDateTime = (date, time) ->
  return null unless (date and time)
  moment("#{date} #{time}", 'L LT').toJSON()

# Creates a Date to update time with TZ data
humanizeDate = (string) ->
  return null unless string
  moment(string).format('L')

# Creates a Date to update time with TZ data
humanizeTime = (string) ->
  return null unless string
  moment(string).format('LT')

_humanizeDateTime = (date, time) ->
  date = humanizeDate(date)
  date += ", #{time}" if time
  date

formatDatesRange = (date1, time1, date2, time2) ->
  time1 = humanizeTime(time1) if time1
  time2 = humanizeTime(time2) if time2
  fullResult = "#{_humanizeDateTime(date1, time1)} – #{_humanizeDateTime(date2, time2)}"

  return null if not date1
  return _humanizeDateTime(date1, time1) if not date2

  return fullResult if date1 isnt date2

  # same dates below
  return humanizeDate(date1) if not time1 and not time2
  return fullResult if not time1
  return "#{_humanizeDateTime(date1, time1)} – #{humanizeDate(date1)}" if not time2

  # times differ
  "#{_humanizeDateTime(date1, time1)} – #{time2}"

formatNumerMax = (number, limit = 99) ->
  return null if typeof number isnt 'number'
  if number > limit then "#{limit}+" else number.toString()

capitalizeFirst = (string = '') -> string.charAt(0).toUpperCase() + string.slice(1)

module.exports = {
  formatNumber, formatDate, formatDateTime,
  humanizeDate, humanizeTime, formatDatesRange,
  formatNumerMax, capitalizeFirst
}
