import { upperFirst } from 'lodash';

const STYLES_PREFIXES = {
  transform: ['Webkit', 'ms'],
};

const USER_AGENT_REGEX = /(\b(BlackBerry|webOS|iPhone|IEMobile)\b)|(\b(Android|Windows Phone|iPad|iPod)\b)/i;


const QUOTE_REGEX = /'/;
const QUOTE_ESCAPE = escape('\'');

/**
 * @function
 * @param {object} styles
 * @return {object}
 */
export const getPrefixed = (styles) => {
  const result = { ...styles };

  for (const key of Object.keys(styles)) {
    if (!STYLES_PREFIXES[key]) continue;

    STYLES_PREFIXES[key].forEach((prefix) => {
      // react uses camelCase
      result[`${prefix}${upperFirst(key)}`] = styles[key];
    });
  }

  return result;
};

export const media = {
  mediaS: '(min-width: 450px)',
  mediaM: '(min-width: 690px)',
  mediaL: '(min-width: 920px)',
};

/**
 * @function
 * @param {Node} node
 * @param query
 * @return {boolean}
 */
export const getMedia = (node, query) => node.matchMedia(query).matches;

/**
 * @function
 * @param {Node} node
 * @return {{top: *, left: *}|{top: number, left: number}}
 */
export const offset = (node) => {
  if (!node) {
    return {
      top: 0,
      left: 0,
    };
  }

  const { offsetParent } = node;

  const offsetTop = offsetParent ? offsetParent.offsetTop : 0;
  const offsetLeft = offsetParent ? offsetParent.offsetLeft : 0;

  return {
    top: node.offsetTop + offsetTop,
    left: node.offsetLeft + offsetLeft,
  };
};

/**
 * @function
 * @param {node} documentContainer
 * @param {Node} node
 * @return {{top: number, left: number}}
 */
export const documentOffset = (documentContainer, node) => {
  if (!documentContainer || !node) throw new Error('Both documentContainer and node are required');
  if (typeof node.getBoundingClientRect !== 'function') throw new Error('Wrong arguments order');

  const { top, left } = node.getBoundingClientRect();

  // can't use scrollX and scrollY because IE
  const { pageXOffset = 0, pageYOffset = 0 } = documentContainer;

  return {
    left: Math.round(left + pageXOffset),
    top: Math.round(top + pageYOffset),
  };
};

/**
 * @function
 * @param {Node} node
 * @return {{top: (number|number|*), left: (number|number|*)}}
 */
export const position = (node) => ({
  left: node.offsetLeft,
  top: node.offsetTop,
});

/**
 * @function
 * @param {Node} node
 * @return {DOMRect}
 */
export const screenPosition = (node) => node.getBoundingClientRect();

/**
 * @function
 * @param {Node} node
 * @return {{width: (number|number|*), height: (number|number|*)}}
 */
export const size = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

/**
 * @function
 * @param {Node} node
 * @return {{width: number, height: number}}
 */
export const screenSize = (node) => ({
  width: node.document.documentElement.clientWidth,
  height: node.document.documentElement.clientHeight,
});

/**
 * @function
 * @param Loader
 * @param {string} url
 * @param done
 * @return {*}
 */
export const preloadImage = (Loader, url, done) => {
  const image = new Loader();
  image.onload = done;
  image.src = url;
  return image;
};

/**
 * @function
 * @param event
 * @return {*}
 */
export const preventDefault = (event) => event.preventDefault();

/**
 * @function
 * @param event
 * @return {*}
 */
export const stopPropagation = (event) => event.stopPropagation();

/**
 * @function
 * @param event
 */
export const stopEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * @function
 * @param event
 * @param args
 * @return {*}
 */
export const eventCoordinates = (event, ...args) => {
  const prop = event.touches ? event.touches[0] : event;
  return args.reduce((acc, name) => {
    acc[name] = prop[name];
    return acc;
  }, {});
};

/**
 * @function
 * @param {string} url
 * @return {string}
 */
export const escapeDomUrl = (url) => url.replace(QUOTE_REGEX, QUOTE_ESCAPE);

/**
 * @function
 * @param {Node} node
 * @return {{unlock: function, get: function, lock: function, to: function}}
 */
export const scroll = (node) => {
  const get = () => node.pageYOffset || node.scrollTop || 0;
  const to = (pos = 0) => {
    if (node.scroll) node.scroll(0, pos);
    else node.scrollTop = pos;
  };

  const lock = () => node.addEventListener('touchmove', preventDefault, { passive: false });
  const unlock = () => node.removeEventListener('touchmove', preventDefault, { passive: false });

  return { get, to, lock, unlock };
};


/**
 * @function isMobileTouchDevice
 * @description Checks if user client is a mobile device
 * @param {Object} window
 * @returns {boolean}
 */
export const isMobileTouchDevice = (window) => {
  const touchPoints = ['maxTouchPoints', 'msMaxTouchPoints'];

  const predicate = (touchpoint) => (
    touchpoint in window?.navigator && window.navigator[touchpoint] > 0
  );
  const hasTouchPoints = touchPoints.some(predicate);
  if (!hasTouchPoints) return false;

  const hasPointerDevice = window?.matchMedia?.('(pointer:coarse)').matches;
  if (!hasPointerDevice) return false;

  if (!('orientation' in window)) return false;

  return USER_AGENT_REGEX.test(window?.navigator.userAgent);
};
