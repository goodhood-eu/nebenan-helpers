{ stringify } = require('querystring')
omit = require('lodash/omit')

{ capitalizeFirst } = require('./formatters')

STYLES_PREFIXES =
  transform: ['Webkit', 'ms']

QUOTE_REGEX = /'/
QUOTE_ESCAPE = escape('\'')
HTTP_REGEX = /^https?:\/\//

getPrefixed = (styles) ->
  for key, value of styles
    continue unless STYLES_PREFIXES[key]

    for prefix in STYLES_PREFIXES[key]
      prefixedKey = "#{prefix}#{capitalizeFirst(key)}" # react uses camelCase
      styles[prefixedKey] = value

  styles

media =
  mediaS: '(min-width: 450px)'
  mediaM: '(min-width: 690px)'
  mediaL: '(min-width: 920px)'

getMedia = (node, media) -> node.matchMedia(media).matches

offset = (node) ->
  return { top: 0, left: 0 } if not node
  offsetParent = node.offsetParent

  top: node.offsetTop + (offsetParent?.offsetTop or 0)
  left:  node.offsetLeft + (offsetParent?.offsetLeft or 0)

documentOffset = (documentContainer, node) ->
  throw new Error('Both documentContainer and node are required') unless documentContainer and node
  throw new Error('Wrong arguments order') unless typeof node.getBoundingClientRect is 'function'

  { top, left } = node.getBoundingClientRect()

  # can't use scrollX and scrollY because IE
  { pageXOffset = 0, pageYOffset = 0 } = documentContainer

  left: Math.round(left + pageXOffset)
  top: Math.round(top + pageYOffset)

position = (node) ->
  left: node.offsetLeft
  top: node.offsetTop

screenPosition = (node) ->
  { top, left } = node.getBoundingClientRect()
  { top, left }

size = (node) ->
  width: node.offsetWidth
  height:  node.offsetHeight

screenSize = (node) ->
  width: node.document.documentElement.clientWidth
  height: node.document.documentElement.clientHeight

preloadImage = (Loader, url, done) ->
  image = new Loader()
  image.onload = done
  image.src = url
  image

preventDefault = (event) ->
  event.preventDefault()

stopPropagation = (event) ->
  event.stopPropagation()

stopEvent = (event) ->
  event.preventDefault()
  event.stopPropagation()

eventCoordinates = (event, args...) ->
  prop = if event.touches then event.touches[0] else event
  result = {}
  result[name] = prop[name] for name in args
  result

escapeDomUrl = (url) -> url.replace(QUOTE_REGEX, QUOTE_ESCAPE)
getBackgroundImageStyle = (url, options) ->
  return null unless typeof url is 'string'
  url = getImageProxyUrl(url, options) if HTTP_REGEX.test(url)
  backgroundImage: "url(\"#{escapeDomUrl(url)}\")"

scroll = (node) ->
  get = -> node.pageYOffset or node.scrollTop or 0
  to = (position = 0) ->
    if node.scroll
      node.scroll(0, position)
    else
      node.scrollTop = position

  lock = -> node.addEventListener('touchmove', preventDefault)
  unlock = -> node.removeEventListener('touchmove', preventDefault)

  { get, to, lock, unlock }

module.exports = {
  getPrefixed,
  media, getMedia,
  documentOffset, position, size, screenSize, offset
  preloadImage,
  preventDefault, stopPropagation, stopEvent,
  eventCoordinates,
  getImageProxyUrl,
  escapeDomUrl,
  getBackgroundImageStyle,
  scroll
  screenPosition
}
