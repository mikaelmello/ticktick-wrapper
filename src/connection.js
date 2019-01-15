/** @module Connection */

const rp = require('request-promise');

/**
 * Base URI for TickTick API v2
 * @private
 * @type {string}
 */
const baseUri = 'https://api.ticktick.com/api/v2';

/**
 * CookieJar where the session cookie is stored
 * @private
 */
const cookieJar = rp.jar();

/**
 * Instance of request-promise that defaults to use pre-defined cookie jar
 * @private
 */
const rpDefaults = rp.defaults({
  jar: cookieJar, // In order to keep authentication cookie ('t') inside jar
});

/**
 * Map of middlewares that are executed before each request
 * @private
 * @type {Object.<string, function>}
 */
let middlewares = {};

/**
 * Overriding of default request in order to run middlewares
 * @private
 * @param  {...any} args - Same arguments of a standard call to 'request'
 * @returns Same as a standard call to 'request'
 */
const request = function _request(...args) {
  for (let name in middlewares) { // eslint-disable-line
    if (typeof middlewares[name] === 'function') {
      middlewares[name](...args);
    }
  }

  return rpDefaults(...args);
};

/**
 * Adds a middleware that is executed before a request
 * @private
 * @param {function} callback - Function to be executed
 */
const addMiddleware = function _addMiddleware(callback) {
  if (typeof callback === 'function') {
    middlewares[callback.name] = callback;
  } else {
    throw new Error('Callback passed as parameter is not a function');
  }
};

/**
 * Removes a middleware that once was executed before a request
 * @private
 * @param {function} callback - Function to be removed
 */
const removeMiddleware = function _removeMiddleware(callback) {
  if (typeof callback === 'function') {
    delete middlewares[callback.name];
  } else {
    delete middlewares[callback];
  }
};

/**
 * Removes all registed middlewares
 * @private
 */
const clearMiddlewares = function _clearMiddlewares() {
  middlewares = {};
};

module.exports = {
  baseUri,
  cookieJar,
  request,
  addMiddleware,
  removeMiddleware,
  clearMiddlewares,
};
