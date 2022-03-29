const unsafeFileCharsRegex = /[\\/:*?"'<>|]/g;
const UARegex = /(\b(BlackBerry|webOS|iPhone|IEMobile)\b)|(\b(Android|Windows Phone|iPad|iPod)\b)/i;

/**
 * @function
 * @param {string} path
 * @param {string} fullPath
 * @return {boolean}
 */
export const isPathActive = (path, fullPath) => {
  const pathChunks = path.split('/');
  const fullPathChunks = fullPath.split('/');

  fullPathChunks.length = pathChunks.length;
  return pathChunks.join('/') === fullPathChunks.join('/');
};

/**
 * @function
 * @param {string} filename
 * @return {string}
 */
export const escapeFileName = (filename) => filename.replace(unsafeFileCharsRegex, '_');

/**
 * @function
 * @param {function} fn
 * @param args
 * @return {*}
 */
export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};

/**
 * @function
 * @param {object} context
 * @param {function} fn
 * @param args
 * @return {*}
 */
export const invokeOn = (context, fn, ...args) => {
  if (context && typeof fn === 'function') return fn.call(context, ...args);
};

/**
 * @function
 * @param {object} context
 * @param funcs
 */
export const bindTo = (context, ...funcs) => funcs.forEach((func) => {
  if (context[func]) context[func] = context[func].bind(context);
});

/**
 * @function isMobileTouchDevice
 * @description Checks if user client is a mobile device
 * @returns {boolean}
 */
export const isMobileTouchDevice = () => {
  const touchPoints = ['maxTouchPoints', 'msMaxTouchPoints'];

  const predicate = (tp) => tp in navigator && navigator[tp] > 0;
  const hasTouchPoints = touchPoints.some(predicate);
  if (!hasTouchPoints) return false;

  const hasPointerDevice = window.matchMedia?.('(pointer:coarse)').matches;
  if (!hasPointerDevice) return false;

  if (!('orientation' in window)) return false;

  return UARegex.test(navigator.userAgent);
};
