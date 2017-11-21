{ assert } = require('chai')
utils = require('../../src//utils/formatters')

dateObj = new Date(2011, 10, 11, 11, 11)
dateString = '11/11/2011'
timeString = '11:11 AM'

dateYMD = '2011-11-11'


describe 'modules/utils/formatters', ->
  it 'formatNumber', ->
    assert.equal(utils.formatNumber(1, 10), '0000000001', 'padded number correctly')
    assert.equal(utils.formatNumber(5), '05', 'sane defaults')
    assert.equal(utils.formatNumber(5000), '50', 'shortened number correctly')
    assert.equal(utils.formatNumber(5000, 7), '0005000', 'padded long number')

  it 'formatDate', ->
    assert.equal(utils.formatDate(), null, 'empty call')
    assert.equal(utils.formatDate(dateString), dateYMD, 'formatted to YMD')

  it 'formatDateTime', ->
    assert.equal(utils.formatDateTime(), null, 'empty call')
    assert.equal(utils.formatDateTime(dateString, timeString), dateObj.toISOString(), 'formatted to ISO')

  it 'humanizeDate', ->
    assert.equal(utils.humanizeDate(), null, 'empty call')
    assert.equal(utils.humanizeDate(dateObj.toISOString()), dateString, 'formatted to locale')

  it 'humanizeTime', ->
    assert.equal(utils.humanizeTime(), null, 'empty call')
    assert.equal(utils.humanizeTime(dateObj.toISOString()), timeString, 'formatted to locale')

  it 'formatDatesRange', ->
    assert.equal(utils.formatDatesRange(), null, 'empty call')

  it 'formatDatesRange - two diff dates, with time', ->
    args = [
      "2016-08-02"
      "2016-08-02T02:00:00.000+02:00"
      "2016-08-03"
      "2016-08-03T03:00:00.000+02:00"
    ]

    expected = '08/02/2016, 2:00 AM – 08/03/2016, 3:00 AM'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - two diff dates, left date no time', ->
    args = [
      "2016-08-02"
      null
      "2016-08-03"
      "2016-08-03T03:00:00.000+02:00"
    ]

    expected = '08/02/2016 – 08/03/2016, 3:00 AM'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - two diff dates, right date no time', ->
    args = [
      "2016-08-02"
      "2016-08-02T02:00:00.000+02:00"
      "2016-08-03"
      null
    ]

    expected = '08/02/2016, 2:00 AM – 08/03/2016'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - two diff dates, no time', ->
    args = [
      "2016-08-02"
      null
      "2016-08-03"
      null
    ]

    expected = '08/02/2016 – 08/03/2016'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - same dates, with time', ->
    args = [
      "2016-08-02"
      "2016-08-02T02:00:00.000+02:00"
      "2016-08-02"
      "2016-08-02T03:00:00.000+02:00"
    ]

    expected = '08/02/2016, 2:00 AM – 3:00 AM'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - same dates, left date no time', ->
    args = [
      "2016-08-02"
      null
      "2016-08-02"
      "2016-08-02T03:00:00.000+02:00"
    ]

    expected = '08/02/2016 – 08/02/2016, 3:00 AM'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - same dates, right date no time', ->
    args = [
      "2016-08-02"
      "2016-08-02T02:00:00.000+02:00"
      "2016-08-02"
      null
    ]

    expected = '08/02/2016, 2:00 AM – 08/02/2016'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatDatesRange - same dates, no time', ->
    args = [
      "2016-08-02"
      null
      "2016-08-02"
      null
    ]

    expected = '08/02/2016'
    result = utils.formatDatesRange(args...)

    assert.equal(result, expected, 'correct dates formatting')

  it 'formatNumerMax', ->
    assert.isNull(utils.formatNumerMax(), 'empty safe')
    assert.isString(utils.formatNumerMax(0), 'correct type')
    assert.equal(utils.formatNumerMax(2), '2', 'correct output')
    assert.equal(utils.formatNumerMax(101), '99+', 'default max')
    assert.equal(utils.formatNumerMax(101, 200), '101', 'custom max')
    assert.equal(utils.formatNumerMax(999, 200), '200+', 'custom max overflow')

  it 'capitalizeFirst', ->
    assert.isString(utils.capitalizeFirst(), 'empty safe')
    assert.isString(utils.capitalizeFirst(''), 'empty string safe')
    assert.equal(utils.capitalizeFirst('A'), 'A', 'doesn\'t corrup data')
    assert.equal(utils.capitalizeFirst('penis'), 'Penis', 'capitalizes')
