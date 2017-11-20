debounce = require('lodash/debounce')
throttle = require('lodash/throttle')

{ RESIZE_RATE, SCROLL_RATE } = require('../constants/times')

# ========================================================================================
# Initialization
# ========================================================================================
isDOMAvailable = process.browser

settingsMap = {}
eventMap = {}
defaultSettings = null
noop = ->

createEventSettings = ->
  settingsMap.resize =
    emitter: global
    wrapper: (callback) -> debounce(callback, RESIZE_RATE)

  settingsMap.scroll =
    emitter: global
    wrapper: (callback) -> throttle(callback, SCROLL_RATE)

  defaultSettings =
    emitter: global.document


# ========================================================================================
# Utility functions
# ========================================================================================
getEventData = (event) ->
  eventMap[event] ?= { listeners: {}, lastIndex: 0, listenersLength: 0 }
  eventMap[event]

getEventSettings = (event) ->
  settingsMap[event] or defaultSettings

handleEmitterEvent = (event) ->
  eventData = getEventData(event.type)
  handler(event) for id, handler of eventData.listeners

attachEmitterHandler = (event, eventData, eventSettings) ->
  if eventData.listenersLength is 1
    eventSettings.emitter.addEventListener(event, handleEmitterEvent)

detachEmitterHandler = (event, eventData, eventSettings) ->
  if eventData.listenersLength is 0
    eventSettings.emitter.removeEventListener(event, handleEmitterEvent)


# ========================================================================================
# Public api
# ========================================================================================
removeListener = (event, id) ->
  eventData = getEventData(event)
  eventSettings = getEventSettings(event)
  return unless eventData.listeners[id] # protect from being called twice

  delete eventData.listeners[id]
  eventData.listenersLength--

  detachEmitterHandler(event, eventData, eventSettings)

addListener = (event, callback) ->
  throw new Error('Event name required') if typeof event isnt 'string'
  throw new Error('Listener function required') if typeof callback isnt 'function'
  return noop unless isDOMAvailable

  eventData = getEventData(event)
  eventSettings = getEventSettings(event)

  id = eventData.lastIndex++
  handler = eventSettings.wrapper?(callback) or callback

  eventData.listeners[id] = handler
  eventData.listenersLength++

  attachEmitterHandler(event, eventData, eventSettings)

  -> removeListener(event, id)

createEventSettings() if isDOMAvailable

module.exports = addListener
