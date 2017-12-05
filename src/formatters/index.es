import moment from 'moment';

export const formatNumber = (number, digits = 2) => {
  const padding = `${10 ** digits}`.slice(1);
  let numberString = String(number);

  if (numberString.length >= digits) return numberString.slice(0, digits);

  numberString = `${padding}${numberString}`;
  return numberString.slice(numberString.length - digits);
};

// Formats date to YMD instead of Date to avoid timezone issues
export const formatDate = (string) => {
  if (!string) return null;
  return moment(string, 'L').format('YYYY-MM-DD');
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return null;
  return moment(`${date} ${time}`, 'L LT').toJSON();
};

// Creates a Date to update time with TZ data
export const humanizeDate = (string) => {
  if (!string) return null;
  return moment(string).format('L');
};

// Creates a Date to update time with TZ data
export const humanizeTime = (string) => {
  if (!string) return null;
  return moment(string).format('LT');
};

const _humanizeDateTime = (date, time) => {
  let humanDate = humanizeDate(date);
  if (time) humanDate += `, ${time}`;
  return humanDate;
};

export const formatDatesRange = (date1, time1, date2, time2) => {
  const humanTime1 = humanizeTime(time1);
  const humanTime2 = humanizeTime(time2);
  const fullResult = `${_humanizeDateTime(date1, humanTime1)} – ${_humanizeDateTime(date2, humanTime2)}`;

  if (!date1) return null;
  if (!date2) return _humanizeDateTime(date1, humanTime1);

  if (date1 !== date2) return fullResult;

  // same dates below
  if (!humanTime1 && !humanTime2) return humanizeDate(date1);
  if (!humanTime1) return fullResult;
  if (!humanTime2) return `${_humanizeDateTime(date1, humanTime1)} – ${humanizeDate(date1)}`;

  // times differ
  return `${_humanizeDateTime(date1, humanTime1)} – ${humanTime2}`;
};

export const formatNumberMax = (number, limit = 99) => {
  if (typeof number !== 'number') return null;
  if (number > limit) return `${limit}+`;
  return number.toString();
};

export const capitalizeFirst = (string = '') => string.charAt(0).toUpperCase() + string.slice(1);
