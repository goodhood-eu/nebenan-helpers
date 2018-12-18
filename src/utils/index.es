const unsafeFileCharsRegex = /[\\/:*?"'<>|]/g;

export const isPathActive = (path, fullPath) => {
  const pathChunks = path.split('/');
  const fullPathChunks = fullPath.split('/');

  fullPathChunks.length = pathChunks.length;
  return pathChunks.join('/') === fullPathChunks.join('/');
};

export const escapeFileName = (filename) => filename.replace(unsafeFileCharsRegex, '_');
export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};

export const invokeOn = (context, fn, ...args) => {
  if (context && typeof fn === 'function') return fn.call(context, ...args);
};

export const bindTo = (context, ...funcs) => funcs.forEach((func) => {
  if (context[func]) context[func] = context[func].bind(context);
});
