import { stringify, parse } from 'qs';

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
