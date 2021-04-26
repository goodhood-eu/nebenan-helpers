import memoize from 'lodash/memoize';
import { stringify, parse } from 'qs';


const PARAM_TOKEN = /(:\w+)<(\w+)>/g;

export const validations = {
  id: '\\d+',
  zipCode: '\\d{5}',
  token: '[\\w-]{20}',
  accessCode: '[\\w]{5}-[\\w]{5}',
  slug: '[\\w-]+',
  stringId: '\\w{6,}',
};

export const getParamReplacer = (typesValidation) => memoize(
  (fragment, param, type) => {
    const regex = typesValidation[type];
    return regex ? `${param}(${regex})` : fragment;
  },
  (fragment, param, type) => JSON.stringify({ fragment, param, type }),
);

export const getValidatedPath = (path, override) => {
  const getReplacement = getParamReplacer({ ...validations, ...override });
  return path.replace(PARAM_TOKEN, getReplacement);
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
