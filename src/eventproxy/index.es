import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

const RESIZE_RATE = 300;
const SCROLL_RATE = 100;

// ========================================================================================
// Initialization
// ========================================================================================
const isDOMAvailable = process.browser;

const settingsMap = {};
const eventMap = {};
const noop = () => {};
const defaultSettings = {};


const createEventSettings = () => {
  settingsMap.resize = {
    emitter: global,
    wrapper(callback) { return debounce(callback, RESIZE_RATE); },
  };

  settingsMap.scroll = {
    emitter: global,
    wrapper(callback) { return throttle(callback, SCROLL_RATE); },
  };

  defaultSettings.emitter = global.document;
};

// ========================================================================================
// Utility functions
// ========================================================================================
const getEventData = (event) => {
  if (!eventMap[event]) eventMap[event] = { listeners: {}, lastIndex: 0, listenersLength: 0 };
  return eventMap[event];
};

const getEventSettings = (event) => settingsMap[event] || defaultSettings;

const handleEmitterEvent = (event) => {
  const eventData = getEventData(event.type);
  Object.keys(eventData.listeners).forEach((id) => eventData.listeners[id](event));
};

const attachEmitterHandler = (event, eventData, eventSettings) => {
  if (eventData.listenersLength === 1) {
    eventSettings.emitter.addEventListener(event, handleEmitterEvent);
  }
};

const detachEmitterHandler = (event, eventData, eventSettings) => {
  if (eventData.listenersLength === 0) {
    eventSettings.emitter.removeEventListener(event, handleEmitterEvent);
  }
};

// ========================================================================================
// Public api
// ========================================================================================
const removeListener = (event, id) => {
  const eventData = getEventData(event);
  const eventSettings = getEventSettings(event);
  // protect from being called twice
  if (!eventData.listeners[id]) return;

  delete eventData.listeners[id];
  eventData.listenersLength -= 1;

  detachEmitterHandler(event, eventData, eventSettings);
};

export const addListener = (event, callback) => {
  if (typeof event !== 'string') throw new Error('Event name required');
  if (typeof callback !== 'function') throw new Error('Listener function required');
  if (!isDOMAvailable) return noop;

  const eventData = getEventData(event);
  const eventSettings = getEventSettings(event);

  eventData.lastIndex += 1;
  const id = eventData.lastIndex;
  const handler = eventSettings.wrapper ? eventSettings.wrapper(callback) : callback;

  eventData.listeners[id] = handler;
  eventData.listenersLength += 1;

  attachEmitterHandler(event, eventData, eventSettings);

  return () => removeListener(event, id);
};

if (isDOMAvailable) createEventSettings();
