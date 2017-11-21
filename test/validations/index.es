import { assert } from 'chai';
import validations from '../../src//validations';

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const PILE_OF_POO = '💩';

describe('modules/validations', () => {
  it('isRequired', () => {
    const truthy = [
      true,
      0,
      'string',
      ['0'],
      { a: 0 },
    ];

    const falsy = [
      undefined,
      false,
      null,
      '',
      [],
      {},
    ];

    truthy.forEach((item) => assert.isTrue(validations.isRequired(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isRequired(item), `Failed for ${item}`));
  });

  it('isLength', () => {
    const item = '1234567';
    assert.isTrue(validations.isLength(item, 1, 10), 'Passed for 1, 10');
    assert.isFalse(validations.isLength(item, 1, 6), 'Failed for 1, 6');
    assert.isTrue(validations.isLength('', 0, 6), 'Failed for 0, 6');
    assert.isTrue(validations.isLength(PILE_OF_POO, 1, 1), 'Failed for unicode');
  });

  it('isRegex', () => {
    const item = 'abc';
    const regexOk = /abc/;
    const regexFail = /def/;

    assert.isTrue(validations.isRegex(item, regexOk, 'Truthy regex'));
    assert.isFalse(validations.isRegex(item, regexFail, 'Falsy regex'));
  });

  it('isEmail', () => {
    const truthy = [
      'a@example.com',
      'a+b@example.com',
      'a.b+c@example.com',
      'a_b.c+d@example.com',
    ];

    const falsy = [
      'a.example.com',
      '@',
      'a@b',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isEmail(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isEmail(item), `Failed for ${item}`));
  });

  it('isPhone', () => {
    const truthy = [
      '+49 157 123 45678',
      '+49 30 123 45678',
      '0 30 123 45678',
      '0 (30) 123 45678',
      '0 (33) 123',
      '0-33-123',
      '0 (33)-123',
      '033-123',
      '+1 23.4(5)6-7',
      '+49', // prob should be falsy lol
    ];

    const falsy = [
      '0',
      '()',
      '+22()._123',
      '030-3030-30303-4567812312312312321312312345678123123123123213123123456781231231231232131231234567812312312312321312312345678123123123123213123123456781231231231232131231234567812312312312321312312345678123123123123213123123',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isPhone(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isPhone(item), `Failed for ${item}`));
  });

  it('isInt', () => {
    assert.isTrue(validations.isInt('123'), 'integer is ok');
    assert.isFalse(validations.isInt('123.45'), 'float is not ok');
  });

  it('isNumber', () => {
    assert.isTrue(validations.isNumber('123'), 'integer is ok');
    assert.isTrue(validations.isNumber('123.45'), 'float is ok');
    assert.isFalse(validations.isNumber('123.45a'), 'number like string is not ok');
  });

  it('isEqual', () => {
    const items = [
      true,
      0,
      'string',
      ['0'],
      { a: 0 },

      false,
      null,
      '',
      [],
      {},
    ];

    items.forEach((item) => assert.isTrue(validations.isEqual(item, item), `Failed for ${item}`));
    items.forEach((item) => assert.isFalse(validations.isEqual(item, PILE_OF_POO), `Failed for ${item}`));
  });

  it('isOneOf', () => {
    const items = [1, 2, 3];
    assert.isTrue(validations.isOneOf(1, ...items, 'Value in array check'));
    assert.isFalse(validations.isOneOf(4, ...items, 'Value not in array check'));
  });

  it('isPassword', () => {
    assert.isTrue(validations.isPassword('qwer1234'), 'Long password');
    assert.isFalse(validations.isPassword('a'), 'Short password');
  });

  it('isShortText', () => {
    assert.isFalse(validations.isShortText('a'), 'Too short');
    assert.isTrue(validations.isShortText('penis'), 'Ok length');
    assert.isFalse(validations.isShortText(lorem), 'Too long');
  });

  it('isLongText', () => {
    assert.isFalse(validations.isLongText('a'), 'Too short');
    assert.isTrue(validations.isLongText('penis'), 'Ok length is ok');
    assert.isTrue(validations.isLongText(lorem), 'Long text ok');
  });

  it('isEmailList', () => {
    const truthy = [
      'a@example.com',
      'a@example.com a+b@example.com',
      'a@example.com a+b@example.com,a.b+c@example.com',
      'a@example.com a+b@example.com,a.b+c@example.com, a_b.c+d@example.com',
    ];

    const falsy = [
      'a.example.com',
      'a.example.com @',
      'a.example.com @,a@b',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isEmailList(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isEmailList(item), `Failed for ${item}`));
  });

  it('isDate', () => {
    const truthy = [
      '07/09/1885',
    ];

    const falsy = [
      null,
      '15.15.15',
      '07.99.1885',
      'penis',
      '123.45.67',
      '123.45.6789',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isDate(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isDate(item), `Failed for ${item}`));
  });

  it('isZipCode', () => {
    const truthy = [
      '12312',
    ];

    const falsy = [
      'asldknalsd',
      'penis',
      '1123',
      '1232g',
      '123212312',
      '1232-12312',
      '12312-1234',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isZipCode(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isZipCode(item), `Failed for ${item}`));
  });

  it('isName', () => {
    const truthy = [
      'Herrbort',
      'Herr bort',
      'Dr. Prof. Herrbort',
      'Herr-bort',
      'Dr. Prof. Herr-Bort',
      'Müllmüller',

      'M\'aiq the Liar',
      'Comte d\'Estaing',
    ];

    const falsy = [
      'Herrbort der 3.',
      'G',
      '1/2=3',
    ];

    truthy.forEach((item) => assert.isTrue(validations.isName(item), `Passed for ${item}`));
    falsy.forEach((item) => assert.isFalse(validations.isName(item), `Failed for ${item}`));
  });
});
