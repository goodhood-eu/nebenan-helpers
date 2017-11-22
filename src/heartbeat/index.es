const HEARTBEAT_INTERVAL = 1000 * 10; // 10sec

const isAlive = process.browser;

const listeners = {};
let lastIndex = 0;
let heartbeatTid = null;

const removeListener = (id) => {
  if (!listeners[id]) return;
  delete listeners[id];
};

const addListener = (interval, callback) => {
  if (typeof callback !== 'function') throw new Error('Listener function required');
  lastIndex += 1;

  const id = lastIndex;
  const called = Date.now();

  listeners[id] = { interval, callback, called };

  return () => removeListener(id);
};

const heartbeatLoop = () => {
  const now = Date.now();

  Object.keys(listeners).forEach((id) => {
    const item = listeners[id];
    if (now - item.called > item.interval) {
      item.callback();
      item.called = now;
    }
  });

  heartbeatTid = setTimeout(heartbeatLoop, HEARTBEAT_INTERVAL);
};

const handleVisibilityChanged = () => {
  if (document.hidden) {
    clearTimeout(heartbeatTid);
    heartbeatTid = null;
  } else heartbeatLoop();
};

if (isAlive) {
  heartbeatLoop();
  document.addEventListener('visibilitychange', handleVisibilityChanged);
}

export default addListener;
