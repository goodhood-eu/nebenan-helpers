import formatDateParsed from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

interface DateWithOptionalTime {
  date: string;
  time?: string;
}

/**
 * Format a number as a string with a specified number of digits.
 *
 * @param {number} number - The number to format.
 * @param {number} [digits=2] - The number of digits to include in the result.
 * @return {string} The formatted number.
 */
export const formatNumber = (number: number, digits = 2): string => {
  const padding = `${10 ** digits}`.slice(1);
  let numberString = String(number);

  if (numberString.length >= digits) return numberString.slice(0, digits);

  numberString = `${padding}${numberString}`;
  return numberString.slice(numberString.length - digits);
};

/**
 * Format a Date object as a string using a specified format.
 *
 * @param {string} date - The date as a ISO string to format.
 * @param {string} format - The date format string.
 * @return {string} The formatted date string.
 */
export const formatDate = (
  date: string, format: string,
): string => formatDateParsed(parseISO(date), format);

/**
 * Get a formatted date and time string for an item with date and optional time properties.
 *
 * @param {DateWithOptionalTime} item - The item with date and optional time properties.
 * @param {object} options - Date and time format options.
 * @param {string} options.dateFormat - The date format string.
 * @param {string} options.timeFormat - The time format string.
 * @return {string} The formatted date and time string.
 */
const getDateTime = (
  item: DateWithOptionalTime,
  options: { dateFormat: string; timeFormat: string },
): string => {
  const date = formatDate(item.date, options.dateFormat);
  return item.time ? `${date}, ${formatDate(item.time, options.timeFormat)}` : date;
};

/**
 * Format a range of dates with optional times into a string.
 *
 * @param {DateWithOptionalTime[]} dates - An array of date and optional time objects.
 * @param {object} options - Date and time format options.
 * @param {string} options.dateFormat - The date format string.
 * @param {string} options.timeFormat - The time format string.
 * @return {string|null} The formatted date range string, or null if the input is invalid.
 */
export const formatDatesRange = (
  dates: DateWithOptionalTime[],
  options: { dateFormat: string; timeFormat: string },
): string | null => {
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
