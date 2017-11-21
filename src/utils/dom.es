import { capitalizeFirst } from './formatters';

const STYLES_PREFIXES = {
  transform: ['Webkit', 'ms'],
};

const QUOTE_REGEX = /'/;
const QUOTE_ESCAPE = escape('\'');

export const getPrefixed = (styles) => {
  const result = { ...styles };

  for (const key of Object.keys(styles)) {
    if (!STYLES_PREFIXES[key]) continue;

    STYLES_PREFIXES[key].forEach((prefix) => {
      // react uses camelCase
      result[`${prefix}${capitalizeFirst(key)}`] = styles[key];
    });
  }

  return result;
};

export const media = {
  mediaS: '(min-width: 450px)',
  mediaM: '(min-width: 690px)',
  mediaL: '(min-width: 920px)',
};

export const getMedia = (node, query) => node.matchMedia(query).matches;

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

export const position = (node) => ({
  left: node.offsetLeft,
  top: node.offsetTop,
});

export const screenPosition = (node) => node.getBoundingClientRect();

export const size = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

export const screenSize = (node) => ({
  width: node.document.documentElement.clientWidth,
  height: node.document.documentElement.clientHeight,
});

export const preloadImage = (Loader, url, done) => {
  const image = new Loader();
  image.onload = done;
  image.src = url;
  return image;
};

export const preventDefault = (event) => event.preventDefault();

export const stopPropagation = (event) => event.stopPropagation();

export const stopEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const eventCoordinates = (event, ...args) => {
  const prop = event.touches ? event.touches[0] : event;
  return args.reduce((acc, name) => {
    acc[name] = prop[name];
    return acc;
  }, {});
};

export const escapeDomUrl = (url) => url.replace(QUOTE_REGEX, QUOTE_ESCAPE);

export const scroll = (node) => {
  const get = () => node.pageYOffset || node.scrollTop || 0;
  const to = (pos = 0) => {
    if (node.scroll) node.scroll(0, pos);
    else node.scrollTop = pos;
  };

  const lock = () => node.addEventListener('touchmove', preventDefault);
  const unlock = () => node.removeEventListener('touchmove', preventDefault);

  return { get, to, lock, unlock };
};
