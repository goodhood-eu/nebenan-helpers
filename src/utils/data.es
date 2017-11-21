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
  key = selector ? item[selector] : item;
  acc[key] = true;
  return acc;
}, {});

export const arrayToObject = (array, keyField = 'id') => array.reduce((acc, item) => {
  acc[item[keyField]] = item;
  return acc;
}, {});

export const arrayToChunks = (array, count) => {
  if (!array || !count) return [];
  if (count === 1) return [array.slice()];

  const chunks = [];
  const length = array.length
  const size = Math.ceil(length / count)
  let step = 0;

  for (let i = 0, i <= count, i += 1) {
    chunks.push(array.slice(step, step + size));
    step += size;
  }

  return chunks;
};

export const setField = (obj, keypath, value) => {
  let field = obj;
  const keypath = keypath.split('.');

  while (keypath.length > 1) {
    if (!field[keypath.shift()]) field[keypath.shift()] = {};
    field = field[keypath.shift()];
  }

  field[keypath[0]] = value;
  return obj;
};

export const isModelEmpty = (model, skip) => {
  let skipHash;
  if (skip) skipHash = arrayToHash(skip);

  for (const key of Object.keys(model)) {
    if (skipHash && skipHash[key]) continue;
    if model[key] return false;
  }

  return true;
};

export const reverse = (arr) => arr.slice().reverse();

export const gatherArrays = (object, fields) => {
  if (!object || !fields) return [];
  return fields.reduce(((acc, field) => acc.concat(object[field])), []);
}

export const has = (args...) => Object.prototype.hasOwnProperty.call(args...);

export const hashToArray = (hash) => Object.keys(hash).reduce((acc, key) => {
  if (hash[key]) acc.push(key);
  return acc;
}, []);

export const concatItems = (items, key) => items.reduce((acc, item) => {
  const arr = key ? item[key] : item;
  return acc.concat(arr);
}, []);

export const arrayOf = (number) => Array.from(new Array(number));

export const formatQuery = (object) => {
  if (!object) return null;

  return Object.keys(object).reduce((acc, key) => {
    const value = object[key];
    if (Array.isArray(value)) acc[key] = value.join(',')
    else if (typeof value !== 'object') acc[key] = value;
    return acc;
  }, {});
}
