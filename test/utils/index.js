const { assert } = require('chai');
const sinon = require('sinon');
const { utils } = require('../../lib/index');

const {
  isPathActive,
  escapeFileName,
  invoke,
  invokeOn,
  bindTo,
} = utils;

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

  it('invokeOn', () => {
    const func = (first, second) => second;
    const spy = sinon.spy();
    const that = 'that';
    invokeOn(that, spy);
    assert.isUndefined(invokeOn(), 'empty call does nothing');
    assert.isUndefined(invokeOn(that), 'call with only context does nothing');
    assert.isTrue(spy.calledOnce, 'called');
    assert.isTrue(spy.calledOn(that), 'called with correct context');
    assert.equal(invokeOn(that, func, 'a', 'b'), 'b', 'passes down args properly');
  });

  it('bindTo', () => {
    const obj = {
      handler() { return this; },
      anotherHandler() { return this; },
    };

    bindTo(obj, 'handler', 'anotherHandler', 'unexistend');

    const result1 = obj.handler();
    const result2 = obj.anotherHandler();

    assert.deepEqual(result1, obj, 'bound 1st func');
    assert.deepEqual(result2, obj, 'bound 2nd func');
  });
});
