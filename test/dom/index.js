const { assert } = require('chai');
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
    const { mediaS, mediaM, mediaL } = media;

    const node1 = {
      media: '(min-width: 450px) (max-width: 800px)',
      matchMedia(query) {
        return { matches: this.media.includes(query) };
      },
    };
    const node2 = {
      media: '(min-width: 690px) (max-width: 800px)',
      matchMedia(query) {
        return { matches: this.media.includes(query) };
      },
    };
    const node3 = {
      media: '(min-width: 920px) (max-width: 800px)',
      matchMedia(query) {
        return { matches: this.media.includes(query) };
      },
    };

    assert.isTrue(getMedia(node1, mediaS));
    assert.isFalse(getMedia(node2, mediaS));
    assert.isTrue(getMedia(node2, mediaM));
    assert.isFalse(getMedia(node3, mediaM));
    assert.isTrue(getMedia(node3, mediaL));
    assert.isFalse(getMedia(node1, mediaL));
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
    const node1 = {
      top: 10,
      left: 100,
      getBoundingClientRect() {
        return { top: this.top, left: this.left };
      },
    };
    const docContainer1 = {
      pageXOffset: 15,
      pageYOffset: 11,
    };

    const node2 = {
      top: 40,
      left: 20,
      getBoundingClientRect() {
        return { top: this.top, left: this.left };
      },
    };
    const docContainer2 = {
      pageXOffset: 15.8,
      pageYOffset: 11.2,
    };

    assert.deepEqual(documentOffset(docContainer1, node1), { left: 115, top: 21 }, 'returns correct values');
    assert.deepEqual(documentOffset(docContainer2, node2), { left: 36, top: 51 }, 'returns correct rounded values');
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

    assert.deepEqual(screenPosition(node), data, 'returns correct object from method');
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

    assert.equal(preventDefault(event), 'prevented default', 'checks if prevent default is present');
  });

  it('stopPropagation', () => {
    const event = {
      stopPropagation() {
        return 'stopped propagation';
      },
    };

    assert.equal(stopPropagation(event), 'stopped propagation', 'checks if stop propagation is present');
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

    assert.isUndefined(stopEvent(event1), 'since it doesn\'t return anything and correct');
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

    /* eslint-disable-next-line */
    for (const elem in data) {
      assert.isDefined(scroll(node)[elem]);
      assert.equal(typeof scroll(node)[elem], data[elem]);
    }
  });
});
