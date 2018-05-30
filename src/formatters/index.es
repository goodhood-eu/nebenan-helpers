import formatDate from 'date-fns/format';

export const formatNumber = (number, digits = 2) => {
  const padding = `${10 ** digits}`.slice(1);
  let numberString = String(number);

  if (numberString.length >= digits) return numberString.slice(0, digits);

  numberString = `${padding}${numberString}`;
  return numberString.slice(numberString.length - digits);
};

const getDateTime = (item, options, locale) => {
  const date = formatDate(item.date, options.dateFormat, { locale });
  return item.time ? `${date}, ${formatDate(item.time, options.timeFormat, { locale })}` : date;
};

export const formatDatesRange = (dates, options = {}, locale) => {
  if (!Array.isArray(dates)) return null;
  const { dateFormat, timeFormat } = options;

  if (!dates[0].date) return null;
  if (!dates[1].date) return getDateTime(dates[0], options, locale);

  const fullResult = dates.map((item) => getDateTime(item, options, locale)).join(' – ');
  if (dates[0].date !== dates[1].date) return fullResult;

  // same dates below
  const humanDate1 = formatDate(dates[0].date, dateFormat, { locale });
  if (!dates[0].time && !dates[1].time) return humanDate1;
  if (!dates[0].time) return fullResult;
  if (!dates[1].time) return `${getDateTime(dates[0], options, locale)} – ${humanDate1}`;

  // times differ
  const humanTime2 = formatDate(dates[1].time, timeFormat, { locale });
  return `${getDateTime(dates[0], options, locale)} – ${humanTime2}`;
};

export const formatNumberMax = (number, limit = 99) => {
  if (typeof number !== 'number') return null;
  if (number > limit) return `${limit}+`;
  return number.toString();
};

export const capitalizeFirst = (string = '') => string.charAt(0).toUpperCase() + string.slice(1);
