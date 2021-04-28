import { getRadian } from './utils';

const EARTH_RADIUS = 6371; // km

export const getID = () => (
  Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
);

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

// Haversine formula
export const getDistance = (lat1, lon1, lat2, lon2) => {
  const dLat = getRadian(lat2 - lat1);
  const dLon = getRadian(lon2 - lon1);

  const dLatSquared = Math.sin(dLat / 2) ** 2;
  const dLonSquared = Math.sin(dLon / 2) ** 2;

  const a = dLatSquared + (dLonSquared * Math.cos(getRadian(lat1)) * Math.cos(getRadian(lat2)));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};
