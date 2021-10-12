/**
 * @function
 * @param {string} key
 * @param {string} prefix
 * @return {string}
 */
const stripPrefix = (key, prefix) => {
  const strippedKey = key.substring(prefix.length);
  return strippedKey.charAt(0).toLowerCase() + strippedKey.slice(1);
};

/**
 * @function
 * @param {object} theme
 * @param {string} prefix
 * @return {{}}
 */
export const getSubTheme = (theme = {}, prefix) => (
  Object.entries(theme)
    .reduce((acc, [key, value]) => {
      if (key.startsWith(prefix)) {
        acc[stripPrefix(key, prefix)] = value;
      }

      return acc;
    }, {})
);

/**
 * @function
 * @param {object} baseTheme
 * @param {object} otherTheme
 * @return {{}|*}
 */
export const mergeThemes = (baseTheme, otherTheme) => {
  if (!otherTheme) return baseTheme;

  return Object.keys(baseTheme).reduce((acc, key) => {
    const baseValue = baseTheme[key];
    const extendValue = otherTheme[key];

    acc[key] = [baseValue, extendValue].filter(Boolean).join(' ');
    return acc;
  }, {});
};
