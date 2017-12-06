const unsafeFileCharsRegex = /[\\/:*?"'<>|]/g;

export const isPathActive = (path, fullPath) => {
  const pathChunks = path.split('/');
  const fullPathChunks = fullPath.split('/');

  fullPathChunks.length = pathChunks.length;
  return path.join('/') === fullPathChunks.join('/');
};

export const escapeFileName = (filename) => filename.replace(unsafeFileCharsRegex, '_');
export const invoke = (fn, ...args) => {
  if (typeof fn === 'function') return fn(...args);
};
