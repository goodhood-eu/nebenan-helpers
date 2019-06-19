const { assert } = require('chai');

const {
  getID,
  getUID,
  getRadian,
  getDistance,
} = require('../../lib/calculations');

const segmentRegex = /^[a-f0-9]+$/;

describe('calculations', () => {
  it('getID', () => {
    const id1 = getID();
    const id2 = getID();

    assert.isString(id1, 'returns a string');
    assert.lengthOf(id1, 4, 'returns proper length');
    assert.notEqual(id1, id2, 'ids don\'t match');
    assert.match(id1, segmentRegex, 'correct pattern format');
  });

  it('getUID', () => {
    const uuid = getUID();
    const regStr = segmentRegex.toString().slice(2, -2);
    const uidRegexString = `^${regStr}${regStr}-${regStr}-${regStr}-${regStr}-${regStr}${regStr}${regStr}$`;

    assert.equal(uuid.split('-').length, 5, 'returns correct number of segments');
    assert.match(uuid, new RegExp(uidRegexString), 'correct pattern format');
  });

  it('getRadian', () => {
    assert.isNumber(getRadian(90), 'returns a number');
    assert.equal(Math.floor(getRadian(57.296)), 1, 'returns correct value for 1');
    assert.equal(Math.floor(getRadian(0)), 0, 'returns correct value for 0');
  });

  it('getDistance', () => {
    assert.isNumber(Math.floor(getDistance(52.5200, 13.4050, 55.7558, 37.6173)), 'returns a number');
    assert.equal(Math.floor(getDistance(52.5200, 13.4050, 55.7558, 37.6173)), 1608, 'returns correct value 1');
    assert.equal(Math.floor(getDistance(52.5200, 13.4050, 37.4749, 122.2594)), 7886, 'returns correct value 2');
  });
});
