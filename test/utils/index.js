const { assert } = require('chai');
const sinon = require('sinon');

const {
  isPathActive,
  escapeFileName,
  invoke,
} = require('../../lib/utils');


describe('utils', () => {
  it('isPathActive', () => {
    assert.isTrue(isPathActive('/hey', '/hey'), 'match the same routes');
    assert.isTrue(isPathActive('/hey', '/hey/man'), 'match children route');
    assert.isFalse(isPathActive('/hey', '/heyyy/man'), 'do not match children with different root route');
    assert.isFalse(isPathActive('/hey', '/chao'), 'do not match different routes');
  });

  it('escapeFileName', () => {
    const file = 'cap\'n penis.jpg';
    const escaped = 'cap_n penis.jpg';

    const xss = '<script>alert(1)</script>';
    const escapedXSS = '_script_alert(1)__script_';

    const weirdShit = 'ich|bin"geil*yea';
    const escapedWeirdShit = 'ich_bin_geil_yea';

    assert.equal(escapeFileName(file), escaped, 'escaped quote correctly');
    assert.equal(escapeFileName(xss), escapedXSS, 'escaped xss correctly');
    assert.equal(escapeFileName(weirdShit), escapedWeirdShit, 'escaped weird filename correctly');
  });

  it('invoke', () => {
    const func = (first, second) => second;
    const spy = sinon.spy();
    invoke(spy);
    assert.isUndefined(invoke(), 'empty call does nothing');
    assert.isTrue(spy.calledOnce, 'called');
    assert.equal(invoke(func, 'a', 'b'), 'b', 'passes down args properly');
  });
});
