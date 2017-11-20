import moment from 'moment';
const unsafeFileCharsRegex = /[\\\/:*?"'<>|]/g;

export const escapeFileName = (filename) => filename.replace(unsafeFileCharsRegex, '_');
export const invoke = (fn, args...) => {
  if (typeof fn === 'function') return fn(args...);
};
