const { assert } = require('chai');

const {
  getRadian,
} = require('../../lib/calculations/utils');

describe('calculations/utils', () => {
  it('getRadian', () => {
    assert.isNumber(getRadian(90), 'returns a number');
    assert.equal(Math.floor(getRadian(57.296)), 1, 'returns correct value for 1');
    assert.equal(Math.floor(getRadian(0)), 0, 'returns correct value for 0');
  });
});
