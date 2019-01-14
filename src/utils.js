const validateCache = function _validateCache(date, maxAgeInMinutes) {
  // check if date is valid via duck typing
  // date instanceof Date will return true for invalid dates
  // e.g. new Date('random_string')
  if (date === undefined || typeof date.getTime !== 'function') {
    return false;
  }

  const then = date.getTime();
  const now = Date.now();
  const maxDifference = maxAgeInMinutes * 60 * 1000;
  const difference = now - then;

  return difference < maxDifference;
};

module.exports = {
  validateCache,
};
