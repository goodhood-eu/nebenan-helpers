export const isSameHash = (hash1, hash2) => (JSON.stringify(hash1) === JSON.stringify(hash2));

export const isSameArray = (source, target, options = {}) => {
  if (source === target) return true;
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  if (source.length !== target.length) return false;

  const sortedSource = source.slice();
  const sortedTarget = target.slice();

  if (!options.sorted) {
    sortedSource.sort();
    sortedTarget.sort();
  }

  return sortedSource.every((element, index) => (sortedTarget[index] === element));
};

export const isSameCollection = (source, target) => {
  if (source === target) return true;
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  return isSameArray(source.map(JSON.stringify), target.map(JSON.stringify), { sorted: true });
};

export const arrayToHash = (array, selector) => array.reduce((acc, item) => {
  const key = selector ? item[selector] : item;
  acc[key] = true;
  return acc;
}, {});

export const arrayToObject = (array, keyField = 'id') => array.reduce((acc, item) => {
  acc[item[keyField]] = item;
  return acc;
}, {});

export const arrayToChunks = (array, count) => {
  if (!array || !count) return [];
  if (count === 1) return [[...array]];

  const chunks = [];
  const length = array.length;
  const size = Math.ceil(length / count);
  let step = 0;

  for (let i = 0; i < count; i += 1) {
    chunks.push(array.slice(step, step + size));
    step += size;
  }

  return chunks;
};

export const isModelEmpty = (model, skip) => {
  let skipHash;
  if (skip) skipHash = arrayToHash(skip);

  for (const key of Object.keys(model)) {
    if (skipHash && skipHash[key]) continue;
    if (model[key]) return false;
  }

  return true;
};

export const reverse = (arr) => arr.slice().reverse();

export const has = (...args) => Object.prototype.hasOwnProperty.call(...args);

export const hashToArray = (hash) => Object.keys(hash).reduce((acc, key) => {
  if (hash[key]) acc.push(key);
  return acc;
}, []);

export const concatItems = (items, key) => items.reduce((acc, item) => {
  const arr = key ? item[key] : item;
  return acc.concat(arr);
}, []);

export const arrayOf = (number) => Array.from(new Array(number)).map((_, index) => index);

export const formatQuery = (object) => {
  if (!object) return null;

  return Object.keys(object).reduce((acc, key) => {
    const value = object[key];
    if (Array.isArray(value)) acc[key] = value.join(',');
    else if (typeof value !== 'object') acc[key] = value;
    return acc;
  }, {});
};

export const ceilToFixed = (float, digits = 2) => {
  const fx = 10 ** digits;
  return Math.ceil(float * fx) / fx;
};
