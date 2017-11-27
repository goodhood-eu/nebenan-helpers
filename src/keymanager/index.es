import * as keyMap from '../constants/keys';

const isDOMAvailable = process.browser;
const normalizeKey = (key) => key.toUpperCase();

const listeners = {};
let lastIndex = 0;

const codes = Object.keys(keyMap).reduce((acc, name) => {
  acc[keyMap[name]] = normalizeKey(name);
  return acc;
}, {});

const removeListener = (id) => {
  if (!listeners[id]) return;
  delete listeners[id];
};

const addListener = (keyNames, callback) => {
  if (typeof callback !== 'function') throw new Error('Listener function required');

  lastIndex += 1;
  const id = lastIndex;

  const keys = keyNames.split(' ').map(normalizeKey);

  listeners[id] = { keys, callback };

  return (() => removeListener(id));
};

const handleKeyDown = (event) => {
  const key = codes[event.keyCode];
  if (!key) return;

  Object.keys(listeners).forEach((id) => {
    // Item may have been deleted during iteration cycle
    if (!listeners[id]) return;
    const { callback, keys } = listeners[id];
    if (keys.includes(key)) callback(event);
  });
};

const attachHandlers = () => document.addEventListener('keydown', handleKeyDown);
if (isDOMAvailable) attachHandlers();

export default addListener;
