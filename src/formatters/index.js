import formatDateParsed from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

/**
 * @function
 * @param {number} number
 * @param {number} digits
 * @return {string}
 */
export const formatNumber = (number, digits = 2) => {
  const padding = `${10 ** digits}`.slice(1);
  let numberString = String(number);

  if (numberString.length >= digits) return numberString.slice(0, digits);

  numberString = `${padding}${numberString}`;
  return numberString.slice(numberString.length - digits);
};

/**
 * @function
 * @param {Date} date
 * @param args
 * @return {string}
 */
export const formatDate = (date, ...args) => formatDateParsed(parseISO(date), ...args);

const getDateTime = (item, options) => {
  const date = formatDate(item.date, options.dateFormat);
  return item.time ? `${date}, ${formatDate(item.time, options.timeFormat)}` : date;
};

/**
 * @function
 * @param {Date[]} dates
 * @param {object} options
 * @return {string|null|*}
 */
export const formatDatesRange = (dates, options = {}) => {
  if (!Array.isArray(dates)) return null;
  const { dateFormat, timeFormat } = options;

  if (!dates[0].date) return null;
  if (!dates[1].date) return getDateTime(dates[0], options);

  const fullResult = dates.map((item) => getDateTime(item, options)).join(' – ');
  if (dates[0].date !== dates[1].date) return fullResult;

  // same dates below
  const humanDate1 = formatDate(dates[0].date, dateFormat);
  if (!dates[0].time && !dates[1].time) return humanDate1;
  if (!dates[0].time) return fullResult;
  if (!dates[1].time) return `${getDateTime(dates[0], options)} – ${humanDate1}`;

  // times differ
  const humanTime2 = formatDate(dates[1].time, timeFormat);
  return `${getDateTime(dates[0], options)} – ${humanTime2}`;
};
