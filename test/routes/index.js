const { assert } = require('chai');

const {
  validations,
  getParamReplacement,
  getValidatedPath,

  getQuery,
  getSearch,
  getPage,
  setReferrer,
} = require('../../lib/routes');


describe('routes', () => {
  it('validations', () => {
    const isInt = [
      '123',
    ];

    const isNotInt = [
      '12asd3',
      '123.78',
    ];

    const getTest = (regex) => (value) => (new RegExp(`^${regex}$`)).test(value);

    isInt.forEach((item) => assert.isTrue(getTest(validations.id)(item), `Passed for ${item}`));
    isNotInt.forEach((item) => assert.isFalse(getTest(validations.id)(item), `Failed for ${item}`));

    const isToken = [
      'a'.repeat(20),
      'abcSDASD123toikg2345',
    ];

    const isNotToken = [
      'a'.repeat(19),
      'abcS-ASD123toikg2$45',
    ];

    isToken.forEach((item) => assert.isTrue(getTest(validations.token)(item), `Passed for ${item}`));
    isNotToken.forEach((item) => assert.isFalse(getTest(validations.token)(item), `Failed for ${item}`));

    const isAccessCode = [
      'a123b-zxcZA',
    ];

    const isNotAccessCode = [
      'a123b-zxcA',
      'a123b-zxcA$',
      'a123bAzxcAz',
    ];

    isAccessCode.forEach((item) => assert.isTrue(getTest(validations.accessCode)(item), `Passed for ${item}`));
    isNotAccessCode.forEach((item) => assert.isFalse(getTest(validations.accessCode)(item), `Failed for ${item}`));
  });

  it('getParamReplacement', () => {
    const result = getParamReplacement(':id', 'id');

    assert.isTrue(/^:id(.+)$/.test(result), 'param replaced correctly');
    assert.equal(getParamReplacement(':id', 'id'), result, 'repeated params replacements work');

    assert.equal(getParamReplacement(':unknown', 'unknown'), ':unknown', 'unknown params passed through');
    assert.equal(getParamReplacement(':unknown', 'unknown'), ':unknown', 'repeated unknown calls work');
  });

  it('getParamReplacement', () => {
    assert.isTrue(/^\/test\/:id(.+)$/.test(getValidatedPath('/test/:id')), 'param replaced correctly');
    assert.isTrue(/^\/test\/:id(.+)?$/.test(getValidatedPath('/test/:id?')), 'optional param replaced correctly');
    assert.isTrue(/^\/test\/:id(.+)*$/.test(getValidatedPath('/test/:id*')), 'repeated param replaced correctly');

    assert.equal(getValidatedPath('/no/params'), '/no/params', 'paths without params work ok');
    assert.equal(getValidatedPath('/no/:param'), '/no/:param', 'unknown params passed through');
  });

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
