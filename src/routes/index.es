import memoize from 'lodash/memoize';
import { stringify, parse } from 'qs';

const REGEX_INT = '\\d+';
const REGEX_SLUG = '[\\w-]+';

export const validations = {
  id: REGEX_INT,
  hoodId: REGEX_INT,
  zipCode: '\\d{5}',
  token: '[\\w-]{20}',
  accessCode: '[\\w]{5}-[\\w]{5}',
  slug: REGEX_SLUG,
  hood: REGEX_SLUG,
  stringId: '\\w{6,}',
};

export const getParamReplacer = (regexMap) => memoize((fragment, param) => {
  const regex = regexMap[param];
  return regex ? `${fragment}(${regex})` : fragment;
});

export const getValidatedPath = (path, override) => {
  const getReplacement = getParamReplacer({ ...validations, ...override });
  return path.replace(/:(\w+)/g, getReplacement);
};

export const getQuery = ({ search }) => parse(search.substr(1));
export const getSearch = (query, prefix = '?') => {
  const string = stringify(query);
  if (!string.length) return '';
  return `${prefix}${string}`;
};

export const getPage = (location) => parseInt(getQuery(location).page, 10) || 1;

export const setReferrer = (pathname, referrer) => (
  `${pathname}${getSearch({ referrer }, pathname.includes('?') ? '&' : '?')}`
);

export const stripOriginFromUrl = (url = '', origin = '') => (
  url.replace(new RegExp(`^${origin}`, 'i'), '')
);
