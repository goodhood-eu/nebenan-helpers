import { getRadian } from './utils';

const EARTH_RADIUS = 6371; // km

/**
 * Pseudo-random ID generator
 * @function
 * @return {string} Generated ID (4 symbols)
 */
export const getID = () => (
  Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
);

/**
 * UUID generator
 * @function
 * @return {string} Generated UUID string
 */
export const getUID = () => (
  [
    getID(),
    getID(),
    '-',
    getID(),
    '-',
    getID(),
    '-',
    getID(),
    '-',
    getID(),
    getID(),
    getID(),
  ].join('')
);

/**
 * Haversine formula
 * @function
 * @param {number} lat1 Latitude coordinate 1
 * @param {number} lon1 Longitude coordinate 1
 * @param {number} lat2 Latitude coordinate 2
 * @param {number} lon2 Longitude coordinate 1
 * @return {number}
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const dLat = getRadian(lat2 - lat1);
  const dLon = getRadian(lon2 - lon1);

  const dLatSquared = Math.sin(dLat / 2) ** 2;
  const dLonSquared = Math.sin(dLon / 2) ** 2;

  const a = dLatSquared + (dLonSquared * Math.cos(getRadian(lat1)) * Math.cos(getRadian(lat2)));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};
