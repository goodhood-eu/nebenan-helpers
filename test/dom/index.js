const { assert } = require('chai');
const utils = require('../../lib/dom');


describe('dom', () => {
  it('getPrefixed', () => {
    const style = { transform: 'translateX(123px)' };
    const result = utils.getPrefixed(style);

    assert.isObject(result, 'returns object');

    assert.isString(result.transform, 'keeps original styles');
    assert.equal(result.WebkitTransform, result.transform, 'sets prefixed styles');
    assert.equal(result.msTransform, result.transform, 'sets prefixed styles');
  });

  it('eventCoordinates', () => {
    const pageX = 123;
    const eventTouch = { touches: [{ pageX }] };

    assert.isUndefined(utils.eventCoordinates({}, 'pageX').pageX, 'handles non existant props ok');
    assert.equal(utils.eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks touch coords correctly');
    assert.equal(utils.eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks mouse coords correctly');
  });

  it('escapeDomUrl', () => {
    const exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg';
    const exibitA_escaped = 'http://pornhub.com/cap%27n penisaroo.jpg';

    assert.equal(utils.escapeDomUrl(exibitA), exibitA_escaped, 'escapes filename correctly');
  });
});
