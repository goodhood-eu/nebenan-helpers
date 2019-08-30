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

export const getParamReplacement = memoize((fragment, param) => {
  const regex = validations[param];
  if (!regex) return fragment;
  return `${fragment}(${regex})`;
});

export const getValidatedPath = (path) => path.replace(/:(\w+)/g, getParamReplacement);

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
