const { assert } = require('chai');

const {
  escapeFileName,
  invoke,
} = require('../../lib/utils');


describe('utils', () => {
  it('escapeFileName', () => {
    const file = 'cap\'n penis.jpg';
    const escaped = 'cap_n penis.jpg';

    const xss = '<script>alert(1)</script>';
    const escapedXSS = '_script_alert(1)__script_';

    const weirdShit = 'ich|bin"geil*yea';
    const escapedWeirdShit = 'ich_bin_geil_yea';

    assert.equal(escapeFileName(file), escaped, 'escaped quote correctly');
    assert.equal(escapeFileName(xss), escapedXSS, 'escaped xss correctly');
    assert.equal(escapeFileName(weirdShit), escapedWeirdShit, 'escaped weird filename correctly');
  });

  it('invoke', () => {
    const args = (first, second) => second;
    assert.isUndefined(invoke(), 'empty call does nothing');
    assert.equal(invoke(args, 'a', 'b'), 'b', 'passes down args properly');
  });
});
