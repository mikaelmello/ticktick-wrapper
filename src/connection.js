const rp = require('request-promise');

/**
 * Class wih connection config
 * @class
 * @private
 */
class Connection {
  constructor() {
    /**
     * Base URI for TickTick API v2
     * @private
     * @type {string}
     */
    this.baseUri = 'https://api.ticktick.com/api/v2';

    /**
     * CookieJar where the session cookie is stored
     * @private
     */
    this.cookieJar = rp.jar();

    /**
     * Instance of request-promise that defaults to use pre-defined cookie jar
     * @private
     */
    this.requestDefault = rp.defaults({
      jar: this.cookieJar,
    });

    /**
     * Map of middlewares that are executed before each request
     * @private
     * @type {Object.<string, function>}
     */
    this.middlewares = {};

    /**
     * Max minutes the cache can live before being refreshed
     * @private
     * @member {Number}
     */
    this._cacheMaxAgeInMinutes = 10;
  }

  /**
   * Overriding of default request in order to run middlewares
   * @private
   * @param  {...any} args - Same arguments of a standard call to 'request'
   * @returns Same as a standard call to 'request'
   */
  request(...args) {
    for (let name in this.middlewares) { // eslint-disable-line
      if (typeof this.middlewares[name] === 'function') {
        this.middlewares[name](...args);
      }
    }

    return this.requestDefault(...args);
  }

  /**
   * Adds a middleware that is executed before a request
   * @private
   * @param {function} callback - Function to be executed
   */
  addMiddleware(callback) {
    if (typeof callback === 'function') {
      this.middlewares[callback.name] = callback;
    } else {
      throw new Error('Callback passed as parameter is not a function');
    }
  }

  /**
   * Removes a middleware that once was executed before a request
   * @private
   * @param {function} callback - Function to be removed
   */
  removeMiddleware(callback) {
    if (typeof callback === 'function') {
      delete this.middlewares[callback.name];
    } else {
      delete this.middlewares[callback];
    }
  }

  /**
   * Removes all registed middlewares
   * @private
   */
  clearMiddlewares() {
    this.middlewares = {};
  }
}

const conn = new Connection();
module.exports = conn;
