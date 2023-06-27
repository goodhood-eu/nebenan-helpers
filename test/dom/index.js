const { assert } = require('chai');
const sinon = require('sinon');

const { dom } = require('../../lib/index');

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
} = dom;


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
      matchMedia: sinon.spy((matches) => ({ matches })),
    };

    getMedia(node, mediaS);
    assert.isTrue(node.matchMedia.calledOnce);
    assert.isTrue(node.matchMedia.calledWith(mediaS));
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
      getBoundingClientRect: sinon.spy((top, left) => ({ top, left })),
    };
    const docContainer = {};

    documentOffset(docContainer, node);
    assert.isTrue(node.getBoundingClientRect.calledOnce);
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
    const node = {
      getBoundingClientRect: sinon.spy(),
    };

    screenPosition(node);

    assert.isTrue(node.getBoundingClientRect.calledOnce);
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
      preventDefault: sinon.spy(),
    };

    preventDefault(event);

    assert.isTrue(event.preventDefault.calledOnce);
  });

  it('stopPropagation', () => {
    const event = {
      stopPropagation: sinon.spy(),
    };

    stopPropagation(event);

    assert.isTrue(event.stopPropagation.calledOnce);
  });

  it('stopEvent', () => {
    const { spy } = sinon;

    const event1 = {
      preventDefault: spy(),
      stopPropagation: spy(),
    };
    const event2 = {
      preventDefault: spy(),
    };
    const event3 = {
      stopPropagation: spy(),
    };

    stopEvent(event1);

    assert.isTrue(event1.preventDefault.calledOnce);
    assert.isTrue(event1.stopPropagation.calledOnce);
    // Tests for presence of methods
    assert.throws(() => stopEvent(event2), Error);
    assert.throws(() => stopEvent(event3), Error);
  });

  it('eventCoordinates', () => {
    const pageX = 123;
    const eventTouch = { touches: [{ pageX }] };

    assert.isUndefined(eventCoordinates({}, 'pageX').pageX, 'handles non existant props ok');
    assert.equal(eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks touch coords correctly');
    assert.equal(eventCoordinates({ pageX }, 'pageX').pageX, pageX, 'picks mouse coords correctly');
  });

  it('escapeDomUrl', () => {
    const exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg';
    const exibitA_escaped = 'http://pornhub.com/cap%27n penisaroo.jpg';

    assert.equal(escapeDomUrl(exibitA), exibitA_escaped, 'escapes filename correctly');
  });

  it('scroll', () => {
    const { spy } = sinon;
    const data = {
      lock: 'function',
      get: 'function',
      to: 'function',
      unlock: 'function',
    };

    const node = {
      addEventListener: spy(),
      removeEventListener: spy(),
      scroll: spy(),
    };

    Object.keys(data).forEach((key) => {
      assert.isFunction(scroll(node)[key]);
    });

    scroll(node).lock();
    assert.isTrue(node.addEventListener.calledOnce);

    scroll(node).unlock();
    assert.isTrue(node.removeEventListener.calledOnce);

    scroll(node).to();
    assert.isTrue(node.scroll.calledOnce);
  });
});
