const { assert } = require('chai');

const {
  validations,
  getParamReplacer,
  getValidatedPath,

  getQuery,
  getSearch,
  getPage,
  setReferrer,

  stripOriginFromUrl,
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

  it('getParamReplacer', () => {
    const getReplacement = getParamReplacer({
      id: '\\d+',
    });

    const result = getReplacement(':itemId[id]', ':itemId', 'id');

    assert.equal(result, ':itemId(\\d+)', 'param replaced correctly');
    assert.equal(getReplacement(':itemId[id]', ':itemId', 'id'), result, 'repeated params replacements work');

    assert.equal(getReplacement(':unknown[customType]', ':unknown', 'customType'), ':unknown[customType]', 'unknown param type passed through');
    assert.equal(getReplacement(':unknown[customType]', ':unknown', 'customType'), ':unknown[customType]', 'repeated unknown calls work');
  });

  it('getValidatedPath', () => {
    assert.isTrue(/^\/test\/:itemId(.+)$/.test(getValidatedPath('/test/:itemId[id]')), 'param replaced correctly');
    assert.isTrue(/^\/test\/:itemId(.+)?$/.test(getValidatedPath('/test/:itemId[id]?')), 'optional param replaced correctly');
    assert.isTrue(/^\/test\/:itemId(.+)*$/.test(getValidatedPath('/test/:itemId[id]*')), 'repeated param replaced correctly');

    assert.equal(getValidatedPath('/no/params'), '/no/params', 'paths without params work ok');
    assert.equal(getValidatedPath('/no/:param'), '/no/:param', 'paths without types check work ok');
    assert.equal(getValidatedPath('/no/:param[customType]'), '/no/:param[customType]', 'params with unknown type passed through');

    const customResult = getValidatedPath('/custom/:param[customType]', { customType: 'kimchin' });
    assert.equal(customResult, '/custom/:param(kimchin)', 'param with custom type replaced correctly');

    assert.isTrue(/^\/test\/:itemId(.+)$/.test(getValidatedPath('/test/:itemId[id]', { customType: 'kimchin' })), 'param replaced correctly with passed custom types');
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

  it('stripOriginFromUrl', () => {
    assert.equal(stripOriginFromUrl(), '', 'empty call');
    assert.equal(stripOriginFromUrl('/my/great/path'), '/my/great/path', 'no origin set');
    assert.equal(stripOriginFromUrl('https://example.com/my/great/path', 'https://example.com'), '/my/great/path', 'cleans up simple route properly');
    assert.equal(stripOriginFromUrl('https://example.com/my/great/path?referrer=https://example.com', 'https://example.com'), '/my/great/path?referrer=https://example.com', 'only removes beginning of the string');
    assert.equal(stripOriginFromUrl('https://somethingelse.com/my/great/path?referrer=https://example.com', 'https://example.com'), 'https://somethingelse.com/my/great/path?referrer=https://example.com', 'only removes beginning of the string - different origin');
    assert.equal(stripOriginFromUrl('https://somethingelse.com/my/great/path', 'https://example.com'), 'https://somethingelse.com/my/great/path', 'different origin');
    assert.equal(stripOriginFromUrl('/my/great/path?referrer=https://example.com', 'https://example.com'), '/my/great/path?referrer=https://example.com', 'only removes beginning of the string - no origin');
    assert.equal(stripOriginFromUrl('/my/great/path', 'https://example.com'), '/my/great/path', 'already a path - does nothing');
  });
});
