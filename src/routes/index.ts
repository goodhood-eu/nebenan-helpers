import memoize from 'lodash/memoize';
import { stringify, parse } from 'qs';

const PARAM_TOKEN = /(:\w+)<(\w+)>/g;

export const validations: Record<string, string> = {
  id: '\\d+',
  zipCode: '\\d{5}',
  accessCode: '[\\w]{5}-[\\w]{5}',
  slug: '[\\w-]+',
  stringId: '\\w{6,}',
};

/**
 * Returns a function that replaces route parameters with regular expressions.
 * @function
 * @param {Record<string, string>} typesValidation - Object mapping route parameter names
 * to regex patterns.
 * @returns {function(string, string, string): string} A memoized function that replaces
 * route parameters.
 */
export const getParamReplacer = (typesValidation: Record<string, string>) => memoize(
  (fragment: string, param: string, type: string) => {
    const regex = typesValidation[type];
    return regex ? `${param}(${regex})` : fragment;
  },
  (fragment: string, param: string, type: string) => JSON.stringify({ fragment, param, type }),
);

/**
 * Replaces route parameters in a path string with regex patterns based on the provided validations.
 * @function
 * @param {string} path - The path string with route parameters.
 * @param {Record<string, string>} override - Object mapping route parameter names to regex
 * patterns (overrides).
 * @returns {string} The path with route parameters replaced by regex patterns.
 */
export const getValidatedPath = (path: string, override: Record<string, string>) => {
  const getReplacement = getParamReplacer({ ...validations, ...override });
  return path.replace(PARAM_TOKEN, getReplacement);
};

/**
 * Parses the query string from a location object and returns it as an object.
 * @function
 * @param {Location} location - The location object containing the search string.
 * @returns {Record<string, string>} An object representing the parsed query parameters.
 */
export const getQuery = (location: Location) => parse(location.search.substring(1));

/**
 * Converts a query object into a query string.
 * @function
 * @param {Record<string, string>} query - The query object to be converted.
 * @param {string} [prefix='?'] - The optional prefix for the query string.
 * @returns {string} The query string representation of the query object.
 */
export const getSearch = (query: Record<string, string>, prefix = '?') => {
  const string = stringify(query);
  if (!string.length) return '';
  return `${prefix}${string}`;
};

/**
 * Retrieves the "page" parameter from the query string in a location object.
 * @function
 * @param {Location} location - The location object containing the search string.
 * @returns {number} The value of the "page" parameter as a number. Defaults to 1 if not found.
 */
export const getPage = (location: Location): number => {
  const page = getQuery(location).page;
  if (page !== undefined) return parseInt(<string>page, 10);
  return 1;
};

/**
 * Appends a "referrer" parameter to a pathname and returns the modified URL.
 * @function
 * @param {string} pathname - The original pathname.
 * @param {string} referrer - The value of the "referrer" parameter.
 * @returns {string} The modified URL with the "referrer" parameter.
 */
export const setReferrer = (pathname: string, referrer: string): string => (
  `${pathname}${getSearch({ referrer }, pathname.includes('?') ? '&' : '?')}`
);

/**
 * Strips the origin portion of a URL string.
 * @function
 * @param {string} url - The URL string.
 * @param {string} origin - The origin to be removed from the URL.
 * @returns {string} The URL with the origin portion removed.
 */
export const stripOriginFromUrl = (url = '', origin = ''): string => (
  url.replace(new RegExp(`^${origin}`, 'i'), '')
);
