/** @module Services */

const conn = require('./connection');
const utils = require('./utils');
const List = require('./list');

/**
 * Lists Service
 */
class Lists {
  constructor() {
    /**
     * Object with cached user lists where the key is the name of the list
     * @private
     * @member {Object.<string, List>}
     */
    this._listsCache = {};

    /**
     * Last time {@link TickTick#_listsCache} was updated
     * @private
     * @member {Date}
     */
    this._listsCacheLastUpdate = undefined;

    this._refreshCache();
  }

  async _requestLists(/* filter */) {
    const options = {
      uri: `${conn.baseUri}/projects`,
      json: true,
    };

    const rawLists = await conn.request(options);

    // map raw lists to object lists
    return rawLists.map(list => new List(list));
  }

  /**
   * Gets a list with a specific name
   * @param {string} name - The name of the list
   * @param {boolean=} forceRefresh - Whether to force a refresh of the cached lists
   * @returns {List|undefined}} {@link List} object or undefined if a list with the
   * provided name does not exist
   */
  async getByName(name, forceRefresh) {
    if (forceRefresh === true) {
      this._listsCacheLastUpdate = undefined;
    }

    await this._checkListsCache();
    return this._listsCache[name];
  }

  /**
   * Verify if the current lists cache has not expired. If it has expired, it will update
   * TickTick's list properties
   * @private
   */
  async _checkListsCache() {
    if (!utils.validateCache(this._listsCacheLastUpdate)) {
      this._refreshCache();

      const listsArray = await this._requestLists();
      for (let i = 0; i < listsArray.length; i += 1) {
        const current = listsArray[i];
        this._listsCache[current.name] = current;
      }

      this._listsCacheLastUpdate = new Date();
    }
  }

  /**
   * Verify if the current lists cache has not expired. If it has expired, it will update
   * TickTick's list properties
   * @private
   */
  _refreshCache() {
    this._listsCacheLastUpdate = undefined;
    this._listsCache = {};
  }

  /**
   * Gets a map of all lists available to the authenticated user
   * @param {boolean=} forceRefresh - Whether to force a refresh of the cached lists
   * @returns {Object.<string, List>} Object with cached user lists where the key is
   * the name of the list
   */
  async getAll(forceRefresh) {
    if (forceRefresh === true) {
      this._refreshCache();
    }

    await this._checkListsCache();
    return this._listsCache;
  }
}

const lists = new Lists();
module.exports = lists;
