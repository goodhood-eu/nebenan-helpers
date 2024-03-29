/**
 * Compare two hashes
 * @function
 * @param {string} hash1
 * @param {string} hash2
 * @return {boolean}
 */
export const isSameHash = (hash1, hash2) => (JSON.stringify(hash1) === JSON.stringify(hash2));

/**
 * Compare two arrays
 * @function
 * @param {any[]} source
 * @param {any[]} target
 * @param {object} [options]
 * @return {boolean}
 */
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

/**
 * Compare two object
 * @function
 * @param {object} source
 * @param {object} target
 * @return {boolean}
 */
export const isSameCollection = (source, target) => {
  if (source === target) return true;
  if (!Array.isArray(source) || !Array.isArray(target)) return false;
  return isSameArray(source.map(JSON.stringify), target.map(JSON.stringify), { sorted: true });
};

/**
 * Convert array to hash
 * @function
 * @param {any[]} array
 * @param {string} [selector]
 * @return {object}
 */
export const arrayToHash = (array, selector) => array.reduce((acc, item) => {
  const key = selector ? item[selector] : item;
  acc[key] = true;
  return acc;
}, {});

/**
 * Convert array to object
 * @function
 * @param {any[]} array
 * @param {string} [keyField]
 * @return {object}
 */
export const arrayToObject = (array, keyField = 'id') => array.reduce((acc, item) => {
  acc[item[keyField]] = item;
  return acc;
}, {});

/**
 * Split array to array of smaller chunks
 * @function
 * @param {any[]} array
 * @param {number} count
 * @return {array}
 */
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

/**
 * @function
 * @param {object} model
 * @param {any[]} [skip]
 * @return {boolean}
 */
export const isModelEmpty = (model, skip) => {
  let skipHash;
  if (skip) skipHash = arrayToHash(skip);

  for (const key of Object.keys(model)) {
    if (skipHash && skipHash[key]) continue;
    if (model[key]) return false;
  }

  return true;
};

/**
 * Reverse (not on place) an array
 * @function
 * @param {any[]} arr
 * @return {array}
 */
export const reverse = (arr) => arr.slice().reverse();

/**
 * @function
 * @param args
 * @return {boolean}
 */
export const has = (...args) => Object.prototype.hasOwnProperty.call(...args);

/**
 * @function
 * @param {object} hash
 * @return {array}
 */
export const hashToArray = (hash) => Object.keys(hash).reduce((acc, key) => {
  if (hash[key]) acc.push(key);
  return acc;
}, []);

/**
 * @function
 * @param {any[]} items
 * @param {string} key
 */
export const concatItems = (items, key) => items.reduce((acc, item) => {
  const arr = key ? item[key] : item;
  return acc.concat(arr);
}, []);

/**
 * @function
 * @param {number} number
 * @return {number[]}
 */
export const arrayOf = (number) => Array.from(new Array(number)).map((_, index) => index);

/**
 * @function
 * @param {number} float
 * @param {number} digits
 * @return {number}
 */
export const ceilToFixed = (float, digits = 2) => {
  const fx = 10 ** digits;
  return Math.ceil(float * fx) / fx;
};
