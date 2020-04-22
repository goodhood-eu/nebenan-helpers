const { assert } = require('chai');
const {
  mergeThemes,
  getSubTheme,
} = require('../../lib/themes');

describe('themes', () => {
  describe('mergeThemes', () => {
    it('returns first theme if second one is undefined', () => {
      const baseTheme = {
        root: 'classname',
      };

      assert.deepEqual(mergeThemes(baseTheme, undefined), baseTheme);
    });

    it('joins strings if both objects contain the same key', () => {
      const baseTheme = {
        root: 'rootClass',
        clever: 'cleverClass',
      };
      const otherTheme = {
        root: 'my-own-root',
        notInBase: 'not-there',
      };

      assert.deepEqual(mergeThemes(baseTheme, otherTheme), {
        root: 'rootClass my-own-root',
        clever: 'cleverClass',
      });
    });
  });

  describe('getSubTheme', () => {
    it('returns empty object for undefined theme', () => {
      assert.deepEqual(getSubTheme(undefined, 'picker'), {});
    });

    it('returns object with stripped keys matching prefix', () => {
      const theme = {
        pickerRoot: 'some-class',
        pickerBaseElement: 'some-base',
        otherRoot: 'other-root',
        otherPicker: 'other-picker',
      };

      assert.deepEqual(getSubTheme(theme, 'picker'), {
        root: 'some-class',
        baseElement: 'some-base',
      });
    });
  });
});
