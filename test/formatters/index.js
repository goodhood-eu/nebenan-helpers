const { assert } = require('chai');
const utils = require('../../lib/formatters');

const dateFormat = 'MM/dd/yyyy';
const timeFormat = 'H:mm a';
const options = { dateFormat, timeFormat };

describe('formatters', () => {
  it('formatNumber', () => {
    const data = {
      stringVal: '21',
      zeroedString: '00012',
      floatString: '12.5',
      number: 42,
      smallNumber: 2,
      largeNumber: 31415926535,
      float: 61.66,
      largeFloat: 3.1415926535,
    };

    assert.equal(utils.formatNumber(1, 10), '0000000001', 'padded number correctly');
    assert.equal(utils.formatNumber(5), '05', 'sane defaults');
    assert.equal(utils.formatNumber(5000), '50', 'shortened number correctly');
    assert.equal(utils.formatNumber(5000, 7), '0005000', 'padded long number');

    assert.isString(utils.formatNumber(data.number));

    assert.equal(utils.formatNumber(data.number), '42', 'passing integer');
    assert.equal(utils.formatNumber(data.smallNumber), '02', 'passing integer');
    assert.equal(utils.formatNumber(data.smallNumber, 20), '00000000000000000002', 'passing integer with large digit');
    assert.equal(utils.formatNumber(data.float), '61', 'passing float');
    assert.equal(utils.formatNumber(data.float, 4), '61.6', 'passing float and digit');
    assert.equal(utils.formatNumber(data.stringVal), '21');
    assert.equal(utils.formatNumber(data.stringVal, 10), '0000000021');
    assert.equal(utils.formatNumber(data.floatString), '12');
    assert.equal(utils.formatNumber(data.floatString, 10), '00000012.5');

    assert.equal(utils.formatNumber(data.largeNumber), '31', 'large number to 2 digits');
    assert.equal(utils.formatNumber(data.largeNumber, 20), '00000000031415926535', 'large number to 20 digits');
    assert.equal(utils.formatNumber(data.largeFloat), '3.', 'long float to 2 digits');
    assert.equal(utils.formatNumber(data.largeFloat, 20), '000000003.1415926535', 'long float to 20 digits');
    assert.equal(utils.formatNumber(data.largeFloat, 6), '3.1415', 'long float to 6 digits');
    assert.equal(utils.formatNumber(data.zeroedString), '00', 'zeroed string to 2 digits');
    assert.equal(utils.formatNumber(data.zeroedString, 20), '00000000000000000012', 'zeroed string to 20 digits');
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
});
