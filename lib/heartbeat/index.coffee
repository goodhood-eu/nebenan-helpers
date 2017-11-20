HEARTBEAT_INTERVAL = 1000 * 10 # 10sec

isAlive = process.browser

listeners = {}
listenersLength = 0
lastIndex = 0
heartbeatTid = null

removeListener = (id) ->
  return unless listeners[id]
  delete listeners[id]
  listenersLength--

addListener = (interval, callback) ->
  throw new Error('Listener function required') if typeof callback isnt 'function'
  id = lastIndex++
  called = Date.now()

  listeners[id] = { interval, callback, called }
  listenersLength++

  -> removeListener(id)

heartbeatLoop = ->
  now = Date.now()
  for id, item of listeners
    if now - item.called > item.interval
      item.callback()
      item.called = now

  heartbeatTid = setTimeout(heartbeatLoop, HEARTBEAT_INTERVAL)

handleVisibilityChanged = ->
  if document.hidden
    clearTimeout(heartbeatTid)
    heartbeatTid = null
  else
    heartbeatLoop()

if isAlive
  heartbeatLoop()
  document.addEventListener('visibilitychange', handleVisibilityChanged)

module.exports = addListener
