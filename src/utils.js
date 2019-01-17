/** @module Utils */

const conn = require('./connection');

/**
 * Checkes whether the current cache has not expired based on its last update date and its max
 * age (in minutes)
 * @private
 * @param {Date} date - Date of cache last update
 * @param {Number} maxAgeInMinutes - Maximum number of minutes that can pass before the cache is
 * invalidated
 * @returns {boolean} Whether the cache is still valid
 */
const validateCache = function _validateCache(date) {
  // check if date is valid via duck typing
  // date instanceof Date will return true for invalid dates
  // e.g. new Date('random_string')
  if (date === undefined || typeof date.getTime !== 'function') {
    return false;
  }

  const then = date.getTime();
  const now = Date.now();
  const maxDifference = conn._cacheMaxAgeInMinutes * 60 * 1000; // difference in milliseconds
  const difference = now - then;

  return difference < maxDifference;
};

/**
 * Converts a Date object into a formatted string suitable for adding a task
 * @private
 * @param {Date} date - Date to be formatted
 * @returns {string} ISO string with Z replaced to '+0000'
 */
function formatDate(date) {
  if (date === undefined) {
    return date;
  }

  let dateString = date;
  if (date instanceof Date) {
    dateString = date.toISOString();
  } else if (typeof dateString !== 'string') {
    throw new Error(`The provided date "${date}" is invalid`);
  }

  return dateString.replace('Z', '+0000');
}

module.exports = {
  validateCache,
  formatDate,
};
