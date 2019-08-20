const { assert } = require('chai');

const {
  getQuery,
  getSearch,
  getPage,
  setReferrer,
} = require('../../lib/routes');


describe('routes', () => {
  it('getQuery', () => {
    assert.deepEqual(getQuery({ search: '' }), {}, 'empty');
    assert.deepEqual(getQuery({ search: '?' }), {}, 'empty 2');
    assert.deepEqual(getQuery({ search: '?test=test' }), { test: 'test' }, '1 param');
    assert.deepEqual(getQuery({ search: '?test=test&number=2' }), { test: 'test', number: '2' }, '2 params');
  });

  it('getSearch', () => {
    assert.deepEqual(getSearch({}), '', 'empty');
    assert.deepEqual(getSearch({ test: 'test' }), '?test=test', '1 param');
    assert.deepEqual(getSearch({ test: 'test', number: '2' }), '?test=test&number=2', '2 params');
    assert.deepEqual(getSearch({ test: 'test', number: '2' }, '+'), '+test=test&number=2', 'custom joiner');
  });


  it('getPage', () => {
    const locationWithoutPage = { search: '' };
    const locationWithPage = { search: '?page=2' };

    assert.equal(getPage(locationWithoutPage), 1, '1 if there is no page param');
    assert.equal(getPage(locationWithPage), 2, 'cast string to int');
  });

  it('setReferrer', () => {
    assert.equal(setReferrer('/route', 'test'), '/route?referrer=test', 'set referrer to simple route');
    assert.equal(setReferrer('/route?a=23', 'test'), '/route?a=23&referrer=test', 'set referrer to route with params');
  });
});
