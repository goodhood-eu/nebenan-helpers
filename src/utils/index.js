const unsafeFileCharsRegex = /[\\/:*?"'<>|]/g;

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
