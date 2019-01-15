/**
 * Checkes whether the current cache has not expired based on its last update date and its max
 * age (in minutes)
 * @param {Date} date - Date of cache last update
 * @param {Number} maxAgeInMinutes - Maximum number of minutes that can pass before the cache is
 * invalidated
 * @return {boolean} - Whether the cache is still valid
 */
const validateCache = function _validateCache(date, maxAgeInMinutes) {
  // check if date is valid via duck typing
  // date instanceof Date will return true for invalid dates
  // e.g. new Date('random_string')
  if (date === undefined || typeof date.getTime !== 'function') {
    return false;
  }

  const then = date.getTime();
  const now = Date.now();
  const maxDifference = maxAgeInMinutes * 60 * 1000; // difference in milliseconds
  const difference = now - then;

  return difference < maxDifference;
};

module.exports = {
  validateCache,
};
