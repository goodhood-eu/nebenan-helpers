const { assert } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noPreserveCache();

let eventproxy;
let handler;

describe('eventproxy', () => {
  beforeEach(() => {
    process.browser = true;
    global.document = {};
    global.document.addEventListener = sinon.spy((event, callback) => { handler = callback; });
    global.document.removeEventListener = sinon.spy();
    global.addEventListener = sinon.spy((event, callback) => { handler = callback; });
    global.removeEventListener = sinon.spy();
    eventproxy = proxyquire('../../lib/eventproxy', {}).default;
  });

  after(() => {
    delete process.browser;
    delete global.document;
    delete global.addEventListener;
    delete global.removeEventListener;
  });

  it('server safe', () => {
    delete process.browser;
    global.document.addEventListener = sinon.spy();
    const servereventproxy = require('../../lib/eventproxy').default;
    const spy = sinon.spy();

    const unsubscribe = servereventproxy('diceroll', spy);

    assert.isTrue(global.document.addEventListener.notCalled, 'didn\'t initialize on server by default');
    assert.isTrue(spy.notCalled, 'didn\'t call callback');
    assert.isFunction(unsubscribe, 'returns a function');

    unsubscribe();
  });

  it('creates listener', () => {
    const spy = sinon.spy();
    const unsubscribe = eventproxy('diceroll', spy);
    assert.isTrue(global.document.addEventListener.calledOnce, 'initialized on client');
    assert.isTrue(spy.notCalled, 'didn\'t call callback');
    unsubscribe();
  });

  it('handles events correctly', () => {
    const spy = sinon.spy();
    const spy2 = sinon.spy();

    const unsubscribe = eventproxy('test', spy);
    const unsubscribe2 = eventproxy('test2', spy2);

    handler({ type: 'test' });
    handler({ type: 'test' });
    unsubscribe();

    handler({ type: 'test' });
    handler({ type: 'test2' });
    unsubscribe2();

    assert.isTrue(spy.calledTwice, 'called twice for correct event');
    assert.isTrue(spy2.calledOnce, 'called once for correct event 2');
  });

  it('throttles default events', () => {
    const spy = sinon.spy();

    const unsubscribe = eventproxy('scroll', spy);
    handler({ type: 'scroll' });
    handler({ type: 'scroll' });
    handler({ type: 'scroll' });
    handler({ type: 'scroll' });
    handler({ type: 'scroll' });
    unsubscribe();

    assert.isTrue(spy.calledOnce, 'called once for correct event');
  });

  it('multiple unsubscribes', () => {
    const spy = sinon.spy();

    const unsubscribe = eventproxy('test', spy);

    handler({ type: 'test' });
    unsubscribe();
    unsubscribe();
    unsubscribe();
    handler({ type: 'test' });

    assert.isTrue(spy.calledOnce, 'called once for correct event');
  });
});
