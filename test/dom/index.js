const { assert } = require('chai');
const sinon = require('sinon');
const {
  getPrefixed,
  media,
  getMedia,
  offset,
  documentOffset,
  position,
  screenPosition,
  size,
  screenSize,
  preventDefault,
  stopPropagation,
  stopEvent,
  eventCoordinates,
  escapeDomUrl,
  scroll,
} = require('../../lib/dom');


describe('dom', () => {
  it('getPrefixed', () => {
    const style = { transform: 'translateX(123px)' };
    const result = getPrefixed(style);

    assert.isObject(result, 'returns object');

    assert.isString(result.transform, 'keeps original styles');
    assert.equal(result.WebkitTransform, result.transform, 'sets prefixed styles');
    assert.equal(result.msTransform, result.transform, 'sets prefixed styles');
  });

  it('media', () => {
    const { mediaS, mediaM, mediaL } = media;

    assert.isString(mediaS);
    assert.isString(mediaM);
    assert.isString(mediaL);
  });

  it('getMedia', () => {
    const { mediaS } = media;

    const node = {
      matchMedia(query) {
        return { query };
      },
    };

    const spy = sinon.spy(node, 'matchMedia');

    getMedia(node, mediaS);
    assert.isTrue(spy.called);
  });

  it('offset', () => {
    const node1 = {
      offsetTop: 10,
      offsetLeft: 10,
    };
    const node2 = {
      offsetTop: 10,
      offsetLeft: 10,
      offsetParent: {
        offsetTop: 10,
        offsetLeft: 10,
      },
    };

    assert.deepEqual(offset(), { top: 0, left: 0 }, 'empty call');
    assert.deepEqual(offset(node1), { top: 10, left: 10 }, 'without parent');
    assert.deepEqual(offset(node2), { top: 20, left: 20 }, 'with parent');
  });

  it('documentOffset', () => {
    const node = {
      getBoundingClientRect() {
        return {};
      },
    };
    const docContainer = {};

    const spy = sinon.spy(node, 'getBoundingClientRect');

    documentOffset(docContainer, node);
    assert.isTrue(spy.called, 'getBoundingClientRect was called');
  });

  it('position', () => {
    const node = {
      offsetLeft: 100,
      offsetTop: 10,
    };

    assert.deepEqual(position(node), { left: 100, top: 10 }, 'return correct object');
    assert.isDefined(position(node).left);
    assert.isDefined(position(node).top);
    assert.equal(Object.keys(position(node)).length, 2, 'Check if no other unnecessary props');
  });

  it('screenPosition', () => {
    const data = {
      x: 20,
      y: 30,
      width: 400,
      height: 200,
      top: -300,
      right: 900,
      bottom: 20,
      left: 500,
    };

    const node = {
      getBoundingClientRect() {
        return data;
      },
    };

    const spy = sinon.spy(node, 'getBoundingClientRect');

    assert.deepEqual(screenPosition(node), data, 'returns correct object from method');
    assert.isTrue(spy.called);
  });

  it('size', () => {
    const node = {
      offsetWidth: 100,
      offsetHeight: 200,
    };

    assert.deepEqual(size(node), { width: 100, height: 200 }, 'correctly changes offset w/h to w/h');
  });

  it('screenSize', () => {
    const node = {
      document: {
        documentElement: {
          clientWidth: 1200,
          clientHeight: 800,
        },
      },
    };

    assert.deepEqual(screenSize(node), { width: 1200, height: 800 }, 'correctly extracts document sizes');
  });

  it('preventDefault', () => {
    const event = {
      preventDefault() {
        return 'prevented default';
      },
    };

    const spy = sinon.spy(event, 'preventDefault');

    preventDefault(event);
    assert.isTrue(spy.called);
  });

  it('stopPropagation', () => {
    const event = {
      stopPropagation() {
        return 'stopped propagation';
      },
    };

    const spy = sinon.spy(event, 'stopPropagation');

    stopPropagation(event);
    assert.isTrue(spy.called);
  });

  it('stopEvent', () => {
    const event1 = {
      preventDefault() {
        return 'prevented default';
      },
      stopPropagation() {
        return 'stopped propagation';
      },
    };
    const event2 = {
      preventDefault() {
        return 'prevented default';
      },
    };
    const event3 = {
      stopPropagation() {
        return 'stopped propagation';
      },
    };

    const spy1 = sinon.spy(event1, 'stopPropagation');
    const spy2 = sinon.spy(event1, 'preventDefault');

    stopEvent(event1);
    assert.isTrue(spy1.called);
    assert.isTrue(spy2.called);
    // Tests for presence of methods
    assert.throws(() => stopEvent(event2), Error);
    assert.throws(() => stopEvent(event3), Error);
  });

  it('eventCoordinates', () => {
    const pageX = 123;
    const eventTouch = { touches: [{ pageX }] };

    assert.isUndefined(eventCoordinates({}, 'pageX').pageX, 'handles non existant props ok');
    assert.equal(eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks touch coords correctly');
    assert.equal(eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks mouse coords correctly');
  });

  it('escapeDomUrl', () => {
    const exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg';
    const exibitA_escaped = 'http://pornhub.com/cap%27n penisaroo.jpg';

    assert.equal(escapeDomUrl(exibitA), exibitA_escaped, 'escapes filename correctly');
  });

  it('scroll', () => {
    const data = {
      lock: 'function',
      get: 'function',
      to: 'function',
      unlock: 'function',
    };
    const node = {};

    Object.keys(data).forEach((key) => {
      assert.isDefined(scroll(node)[key]);
      assert.equal(typeof scroll(node)[key], data[key]);
    });
  });
});
