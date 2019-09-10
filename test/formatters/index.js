const { assert } = require('chai');
const utils = require('../../lib/formatters');

const dateFormat = 'MM/dd/yyyy';
const timeFormat = 'H:mm a';
const options = { dateFormat, timeFormat };

describe('formatters', () => {
  it('formatNumber', () => {
    assert.equal(utils.formatNumber(1, 10), '0000000001', 'padded number correctly');
    assert.equal(utils.formatNumber(5), '05', 'sane defaults');
    assert.equal(utils.formatNumber(5000), '50', 'shortened number correctly');
    assert.equal(utils.formatNumber(5000, 7), '0005000', 'padded long number');
  });

  it('formatDate', () => {
    assert.equal(utils.formatDate('2016-08-02', 'yyyy HH:mm'), '2016 00:00', 'padded number correctly');
    assert.equal(utils.formatDate('2016-08-02T02:00:00.000+02:00', 'yyyy HH:mm'), '2016 00:00', 'sane defaults');
    assert.equal(utils.formatDate('2016-08-02 02:00', 'yyyy HH:mm'), '2016 02:00', 'sane defaults');
  });

  it('formatDatesRange', () => assert.equal(utils.formatDatesRange(), null, 'empty call'));

  it('formatDatesRange - two diff dates, with time', () => {
    const dates = [
      {
        date: '2016-08-02',
        time: '2016-08-02T02:00:00.000+02:00',
      },
      {
        date: '2016-08-03',
        time: '2016-08-03T03:00:00.000+02:00',
      },
    ];

    const expected = '08/02/2016, 0:00 AM – 08/03/2016, 1:00 AM';
    const result = utils.formatDatesRange(dates, options);
    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - two diff dates, left date no time', () => {
    const dates = [
      {
        date: '2016-08-02',
      },
      {
        date: '2016-08-03',
        time: '2016-08-03T03:00:00.000+02:00',
      },
    ];

    const expected = '08/02/2016 – 08/03/2016, 1:00 AM';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - two diff dates, right date no time', () => {
    const dates = [
      {
        date: '2016-08-02',
        time: '2016-08-02T02:00:00.000+02:00',
      },
      {
        date: '2016-08-03',
      },
    ];

    const expected = '08/02/2016, 0:00 AM – 08/03/2016';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - two diff dates, no time', () => {
    const dates = [
      {
        date: '2016-08-02',
      },
      {
        date: '2016-08-03',
      },
    ];

    const expected = '08/02/2016 – 08/03/2016';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - same dates, with time', () => {
    const dates = [
      {
        date: '2016-08-02',
        time: '2016-08-02T02:00:00.000+02:00',
      },
      {
        date: '2016-08-02',
        time: '2016-08-02T03:00:00.000+02:00',
      },
    ];

    const expected = '08/02/2016, 0:00 AM – 1:00 AM';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - same dates, left date no time', () => {
    const dates = [
      {
        date: '2016-08-02',
      },
      {
        date: '2016-08-02',
        time: '2016-08-02T03:00:00.000+02:00',
      },
    ];

    const expected = '08/02/2016 – 08/02/2016, 1:00 AM';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - same dates, right date no time', () => {
    const dates = [
      {
        date: '2016-08-02',
        time: '2016-08-02T02:00:00.000+02:00',
      },
      {
        date: '2016-08-02',
        time: null,
      },
    ];

    const expected = '08/02/2016, 0:00 AM – 08/02/2016';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('formatDatesRange - same dates, no time', () => {
    const dates = [
      {
        date: '2016-08-02',
        time: null,
      },
      {
        date: '2016-08-02',
        time: null,
      },
    ];

    const expected = '08/02/2016';
    const result = utils.formatDatesRange(dates, options);

    assert.equal(result, expected, 'correct dates formatting');
  });

  it('capitalizeFirst', () => {
    assert.isString(utils.capitalizeFirst(), 'empty safe');
    assert.isString(utils.capitalizeFirst(''), 'empty string safe');
    assert.equal(utils.capitalizeFirst('A'), 'A', 'doesn\'t corrup data');
    assert.equal(utils.capitalizeFirst('penis'), 'Penis', 'capitalizes');
  });
});
