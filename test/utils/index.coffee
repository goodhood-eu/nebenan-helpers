moment = require('moment')
{ assert } = require('chai')

{
  escapeFileName
  invoke
} = require('../../src/utils/misc')


describe 'modules/utils/misc', ->
  it 'escapeFileName', ->
    file = 'cap\'n penis.jpg'
    escaped = 'cap_n penis.jpg'

    xss = '<script>alert(1)</script>'
    escapedXSS = '_script_alert(1)__script_'

    weirdShit = 'ich|bin"geil*yea'
    escapedWeirdShit = 'ich_bin_geil_yea'

    assert.equal(escapeFileName(file), escaped, 'escaped quote correctly')
    assert.equal(escapeFileName(xss), escapedXSS, 'escaped xss correctly')
    assert.equal(escapeFileName(weirdShit), escapedWeirdShit, 'escaped weird filename correctly')

  it 'invoke', ->
    noop = -> 'kalld!'
    args = (first, second) -> second
    assert.isUndefined(invoke(), 'empty call does nothing')
    assert.equal(invoke(args, 'a', 'b'), 'b', 'passes down args properly')
