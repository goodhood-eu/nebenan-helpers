{ assert } = require('chai')
{ stringify } = require('querystring')
utils = require('../../src/utils/dom')


describe 'modules/utils/dom', ->
  it 'getPrefixed', ->
    style = transform: "translateX(123px)"
    result = utils.getPrefixed(style)

    assert.isObject(result, 'returns object')

    assert.isString(result.transform, 'keeps original styles')
    assert.equal(result.WebkitTransform, result.transform, 'sets prefixed styles')
    assert.equal(result.msTransform, result.transform, 'sets prefixed styles')

  it 'eventCoordinates', ->
    pageX = 123
    eventTouch =
      touches: [{ pageX }]

    eventMouse = { pageX }

    assert.isUndefined(utils.eventCoordinates({}, 'pageX').pageX, 'handles non existant props ok')
    assert.equal(utils.eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks touch coords correctly')
    assert.equal(utils.eventCoordinates(eventTouch, 'pageX').pageX, pageX, 'picks mouse coords correctly')

  it 'escapeDomUrl', ->
    exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg'
    exibitA_escaped = 'http://pornhub.com/cap%27n penisaroo.jpg'

    assert.equal(utils.escapeDomUrl(exibitA), exibitA_escaped, 'escapes filename correctly')
