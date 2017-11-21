config = require('uni-config')
{ assert } = require('chai')
{ stringify } = require('querystring')
utils = require('../../src//utils/dom')


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

  it 'getImageProxyUrl', ->
    exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg'
    exibitB = 'http://pornhub.com/ку\'й пока горячо.jpg?bestellung=kebap+mit+sauerkraut&bezahlung=bargeld'

    escapedA = stringify(src: exibitA)
    escapedB = stringify(src: exibitB)

    expectedA = "#{config.client.image_proxy_root}/resize.jpg?#{escapedA}"
    expectedB = "#{config.client.image_proxy_root}/resize.jpg?width=100&#{escapedA}"
    expectedC = "#{config.client.image_proxy_root}/resize.jpg?width=100&height=100&#{escapedA}"
    expectedD = "#{config.client.unsecure_image_proxy_root}/resize.jpg?width=100&height=100&#{escapedB}"
    expectedE = "#{config.client.image_proxy_root}/crop.jpg?#{escapedA}"

    assert.isString(utils.getImageProxyUrl(exibitA), 'returns string')
    assert.isNull(utils.getImageProxyUrl(), 'doesn\'t explode with empty params')
    assert.equal(utils.getImageProxyUrl(exibitA), expectedA, 'results match')
    assert.equal(utils.getImageProxyUrl(exibitA, width: 100), expectedB, 'adds width')
    assert.equal(utils.getImageProxyUrl(exibitA, width: 100, height: 100), expectedC, 'adds height')
    assert.equal(utils.getImageProxyUrl(exibitB, width: 100, height: 100, unsafe: true), expectedD, 'converts to unsafe url')
    assert.equal(utils.getImageProxyUrl(exibitA, crop: true), expectedE, 'supports crop match')

  it 'escapeDomUrl', ->
    exibitA = 'http://pornhub.com/cap\'n penisaroo.jpg'
    exibitA_escaped = 'http://pornhub.com/cap%27n penisaroo.jpg'

    assert.equal(utils.escapeDomUrl(exibitA), exibitA_escaped, 'escapes filename correctly')

  it 'getBackgroundImageStyle', ->
    file = 'foobar.jpg'
    url = 'http://example.com/image.jpg'
    result = utils.getBackgroundImageStyle(file)
    expected = "url(\"#{file}\")"

    assert.isObject(result, 'returns object')
    assert.equal(result.backgroundImage, expected, 'sets correct styles')
    assert.include(result.backgroundImage, file, 'resembles correct url')
    assert.include(utils.getBackgroundImageStyle(url).backgroundImage, config.client.image_proxy_root, 'proxies external urls')
