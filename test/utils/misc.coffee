moment = require('moment')
config = require('uni-config')
{ assert } = require('chai')

{
  isPathActive
  isExternalUrl
  isPastDate
  escapeFileName
  getNumberBetween
  getAppAuthorizationUrl
  getAbsoluteUrl
  getPage
  getRelativeUrl
  getHoodsBounds
  getLogoClass
  getSnakedLocale
  invoke
} = require('../lib/utils/misc')


describe 'modules/utils/misc', ->
  it 'isPathActive', ->
    assert.isTrue(isPathActive('/hey', '/hey'), 'match the same routes')
    assert.isTrue(isPathActive('/hey', '/hey/man'), 'match children route')
    assert.isFalse(isPathActive('/hey', '/heyyy/man'), 'do not match children with different root route')
    assert.isFalse(isPathActive('/hey', '/chao'), 'do not match different routes')

  it 'isExternalUrl', ->
    url = "#{config.client.trusted_root}/iam/yourfather"
    absoluteRoute = '/spider/man'
    relativeRoute = 'bat/man'

    externalUrl = 'http://www.ablay.com/cool-tester'
    tlsExternalUrl = 'https://www.ablay.com/cool-tester'
    nativeExternalUrl = 'http://жепь.рф/ебрило'
    mailtoLink = 'mailto:василий@главпочта.кз'

    proxyLink = '/go/hello'
    tlsProxyLink = "#{config.client.trusted_root}/go/hello"
    notProxyLink = "/dize/go/hello"

    fileUrl = '/beatiful.png'

    assert.isFalse(isExternalUrl(url), 'ignore urls of current domain')
    assert.isFalse(isExternalUrl(absoluteRoute), 'ignore absolute routes')
    assert.isFalse(isExternalUrl(relativeRoute), 'ignore relative routes')
    assert.isFalse(isExternalUrl(notProxyLink), 'ignore link which contains part of proxy link')

    assert.isTrue(isExternalUrl(externalUrl), 'external links')
    assert.isTrue(isExternalUrl(tlsExternalUrl), 'tls external links')
    assert.isTrue(isExternalUrl(nativeExternalUrl), 'native links')
    assert.isTrue(isExternalUrl(mailtoLink), 'mailto links')
    assert.isTrue(isExternalUrl(proxyLink), 'proxy links')
    assert.isTrue(isExternalUrl(tlsProxyLink), 'absolute proxy links')
    assert.isTrue(isExternalUrl(fileUrl), 'file link')

  it 'isPastDate', ->
    futureDate = moment().add(1, 'day').toISOString()
    pastDate = moment().subtract(1, 'day').toISOString()

    futureDateTime = moment().add(1, 'minute').toISOString()
    pastDateTime = moment().subtract(1, 'minute').toISOString()

    assert.isFalse(isPastDate(futureDate), 'check future date')
    assert.isTrue(isPastDate(pastDate), 'check past date')

    assert.isFalse(isPastDate(futureDate, futureDateTime), 'check future date time')
    assert.isTrue(isPastDate(pastDate, pastDateTime), 'check past date time')

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

  it 'getNumberBetween', ->
    max = 100
    min = 0

    assert.equal(getNumberBetween(10, max, min), 10, 'do not change value if boundaries are not reached')
    assert.equal(getNumberBetween(1000, max, min), 100, 'return max value if max limit is exceeded')
    assert.equal(getNumberBetween(-10, max, min), 0, 'return min value if min limit is exceeded')

  it 'getAppAuthorizationUrl', ->
    token = 'abc'
    url = getAppAuthorizationUrl(token)

    assert.isTrue(/^nebenan:\/\//.test(url), 'insert app url scheme')
    assert.include(url, '/abc', 'token is included')

  it 'getAbsoluteUrl', ->
    { trusted_root } = config.client

    assert.equal(getAbsoluteUrl(null), trusted_root, 'when null or no args returns domain link')
    assert.equal(getAbsoluteUrl('/penis'), "#{trusted_root}/penis", 'returns correct link')
    assert.equal(getAbsoluteUrl('honeybooboo'), "#{trusted_root}/honeybooboo", 'when path has no leading slash appends slash')

  it 'getRelativeUrl', ->
    { trusted_root } = config.client

    externalUrl = "https://vk.com/im?sel=135532546"
    absoluteUrl = "#{trusted_root}/penis"
    relativeUrl = "/penis"

    assert.equal(getRelativeUrl(null), null, 'nothing if nothing was passed')
    assert.equal(getRelativeUrl(externalUrl), externalUrl, 'do not change external url')
    assert.equal(getRelativeUrl(absoluteUrl), '/penis', 'exclude root')
    assert.equal(getRelativeUrl(relativeUrl), '/penis', 'do nothing if already relative')

  it 'getPage', ->
    locationWithoutPage = { query: {} }
    locationWithPage = { query: { page: '2' } }

    assert.equal(getPage(locationWithoutPage), 1, 'return 1 if there is no page param')
    assert.equal(getPage(locationWithPage), 2, 'cast string to int')

  it 'getHoodsBounds', ->
    items = [{ area: [1, 2] }, { area: [3, 4] }]
    ids = [1, 2]
    entities = { 1: { area: [5, 6] }, 2: { area: [7, 8] } }

    assert.deepEqual(getHoodsBounds(items), [1, 2, 3, 4], 'get bounds from objects');
    assert.deepEqual(getHoodsBounds(ids, entities), [5, 6, 7, 8], 'get bounds from ids');
    assert.deepEqual(
      getHoodsBounds([items..., ids...], entities)
      [1, 2, 3, 4, 5, 6, 7, 8]
      'mixed array'
    )

  it 'getSnakedLocale', ->
    assert.equal(getSnakedLocale(), 'de_de', 'returns default locale')
    assert.equal(getSnakedLocale('de-FR'), 'de_fr', 'returns passed locale')

  it 'getLogoClass', ->
    assert.include(getLogoClass(), 'icon-logo_type_', 'returns default logo')
    assert.equal(getLogoClass('de-FR'), 'icon-logo_type_de_fr', 'returns correct logo')

  it 'invoke', ->
    noop = -> 'kalld!'
    args = (first, second) -> second
    assert.isUndefined(invoke(), 'empty call does nothing')
    assert.equal(invoke(args, 'a', 'b'), 'b', 'passes down args properly')
