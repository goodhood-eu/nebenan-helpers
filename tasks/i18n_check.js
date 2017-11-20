const { logSuccess, logError, logWarning } = require('./utils');
const locales = require('../i18n');

const getKey = (prefix, key) => (prefix ? `${prefix}.${key}` : key);
const varRegex = /^%{[\w-]+}$/;
const moduleRegex = /^[a-z]{2}-[A-Z]{2}\.modules\./;

const isObject = (value) => typeof value === 'object';
const isString = (value) => typeof value === 'string';
const isSkipped = (value) => moduleRegex.test(value);
const getPropType = (value) => (isObject(value) ? 'object' : 'key');

const isSubstring = (source, target) => {
  if (!isString(source) || !isString(target)) return false;
  if (target === source && varRegex.test(source)) return false;
  return target.includes(source.trim());
};

const findMissing = (...languages) => languages.filter((key) => !locales[key])[0];

const diffObjectProps = (master, target, prefix) => {
  let diff = [];

  Object.keys(master).forEach((key) => {
    const masterValue = master[key];
    const targetValue = target[key];

    if (masterValue && targetValue && isObject(masterValue) && isObject(targetValue)) {
      const nested = diffObjectProps(masterValue, targetValue, `${prefix}.${key}`);
      diff = diff.concat(nested);
      return;
    }

    // Potentially contains wrong language
    if (!isSkipped(prefix) && isSubstring(masterValue, targetValue)) {
      const path = getKey(prefix, key);
      const message = 'contains value from target language';

      diff.push({ path, message, type: 'warning' });
    }

    // Keys weren't added yet
    if (masterValue && !targetValue) {
      const path = getKey(prefix, key);
      const propType = getPropType(masterValue);
      const message = `missing ${propType} - not present in target language`;
      return diff.push({ path, message, type: 'error' });
    }
  });

  Object.keys(target).forEach((key) => {
    const masterValue = master[key];
    const targetValue = target[key];

    // Pick up keys that weren't deleted
    if (!masterValue && targetValue) {
      const path = getKey(prefix, key);
      const propType = getPropType(targetValue);
      const message = `unnecessary ${propType} - not present in master language`;

      return diff.push({ path, message, type: 'error' });
    }
  });

  return diff;
};

const formatDiff = (array) => {
  array.sort((a, b) => {
    const [firstA, firstB] = [a, b].map((item) => item.path.split('.')[2].toLowerCase());

    if (firstA < firstB) return -1;
    if (firstA > firstB) return 1;
    return 0;
  });
  return array.map(({ path, message }) => `  ${path}: ${message}`).join('\n');
};

const process = (masterLanguage, targetLanguage) => {
  const missing = findMissing(masterLanguage, targetLanguage);
  if (missing) logError(`Dictionary for ${missing} doesn't exist`);

  const master = locales[masterLanguage];
  const target = locales[targetLanguage];

  const diff = diffObjectProps(master, target, targetLanguage);
  const errors = diff.filter((item) => item.type === 'error');
  const warnings = diff.filter((item) => item.type === 'warning');

  if (errors.length) {
    const message = `${errors.length} Errors found:\n${formatDiff(errors)}`;
    return logError(message);
  }

  if (warnings.length) {
    const message = `${warnings.length} Warnings found:\n${formatDiff(warnings)}`;
    logWarning(message);
  }

  logSuccess(`${masterLanguage} and ${targetLanguage} have equal coverage!`);
};

module.exports = process;
