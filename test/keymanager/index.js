const { assert } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noPreserveCache();
const { ESC, ENTER } = require('../../lib/constants/keys');

let keymanager;
let handler;

describe('keymanager', () => {
  beforeEach(() => {
    process.browser = true;
    global.document = {};
    global.document.addEventListener = sinon.spy((event, callback) => { handler = callback; });
    keymanager = proxyquire('../../lib/keymanager', {}).default;
  });

  after(() => {
    delete process.browser;
    delete global.document;
  });

  it('server safe', () => {
    delete process.browser;
    global.document.addEventListener = sinon.spy();
    const serverkeymanager = require('../../lib/keymanager').default;
    const spy = sinon.spy();
    const unsubscribe = serverkeymanager('esc', spy);

    assert.isTrue(global.document.addEventListener.notCalled, 'didn\'t initialize on server by default');
    assert.isTrue(spy.notCalled, 'didn\'t call callback');
    assert.isFunction(unsubscribe, 'returns a function');

    unsubscribe();
  });

  it('creates listener', () => {
    assert.isTrue(global.document.addEventListener.calledOnce, 'initialized on client');
  });

  it('handles events correctly', () => {
    const spy = sinon.spy();
    const spy2 = sinon.spy();

    const unsubscribe = keymanager('esc', spy);
    const unsubscribe2 = keymanager('enter', spy2);

    handler({ keyCode: ESC });
    handler({ keyCode: ENTER });
    handler({ keyCode: 80085 });
    unsubscribe();
    unsubscribe2();

    handler({ keyCode: ESC });
    handler({ keyCode: ENTER });

    assert.isTrue(spy.calledOnce, 'called once for correct event');
    assert.isTrue(spy2.calledOnce, 'called once for correct event 2');
  });

  it('multiple unsubscribes', () => {
    const spy = sinon.spy();
    const unsubscribe = keymanager('esc', spy);

    handler({ keyCode: ESC });
    unsubscribe();
    unsubscribe();
    unsubscribe();
    handler({ keyCode: ESC });

    assert.isTrue(spy.calledOnce, 'called once for correct event');
  });
});
