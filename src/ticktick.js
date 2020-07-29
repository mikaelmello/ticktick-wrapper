/** @module TickTick */

const conn = require('./connection');
const utils = require('./utils');
const auth = require('./auth');
const tasks = require('./tasks');
const lists = require('./lists');
const List = require('./list');
const Task = require('./task');
const Reminder = require('./reminder');

/**
 * Wrapper's main class
 * @class
 */
function TickTick() {
  conn.addMiddleware(auth.assertLogin);

  /**
   * Information about the authenticated user
   * @member {Object}
   * @property {string} username - Authenticated user's username
   * @property {string} id - Account ID of the authenticated user
   * @property {boolean} pro - Whether the authenticated user has a pro account
   */
  this.user = {};

  /**
   * Inbox list of the authenticated user
   * @member {List|undefined}
   */
  this.Inbox = undefined;

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
}

/**
 * Authenticate with TickTick and store the session info for future calls.
 * This method must be called *before* any other.
 * @param {Object} options - Login options
 * @param {Object=} options.email - Object that must exist if the login is done via email
 * @param {string} options.email.username - Your TickTick's account e-mail
 * @param {string} options.email.password - Your TickTick's account password
 */
TickTick.prototype.login = async function _login(options) {
  if (!options) {
    throw new auth.errors.NoLoginProviderSelectedError();
  }
  try {
    conn.removeMiddleware(auth.assertLogin);
    let userInfo;
    if (options.email) {
      userInfo = await auth.loginEmail(options.email);
    } else if (options.google) {
      userInfo = await auth.loginGoogle(options.google);
    } else if (options.facebook) {
      userInfo = await auth.loginFacebook(options.facebook);
    } else if (options.twitter) {
      userInfo = await auth.loginTwitter(options.twitter);
    } else {
      throw new auth.errors.NoLoginProviderSelectedError();
    }

    this._setUserInfo(userInfo);
  } finally {
    conn.addMiddleware(auth.assertLogin);
  }
};

/**
 * Stores local information about the authenticated user
 * @private
 * @param {Object} userInfo - User Innformation
 * @param {string} userInfo.inboxId - Id of the authenticated ser's Inbox list
 * @param {string} userInfo.username - Authenticated user's username
 * @param {string} userInfo.id - Account ID of the authenticated user
 * @param {boolean} userInfo.pro - Whether the authenticated user has a pro account
 */
TickTick.prototype._setUserInfo = function _setUserInfo(userInfo) {
  this.user.username = userInfo.username;
  this.user.isPro = userInfo.pro;
  this.user.id = userInfo.userId;
  this.Inbox = new List({
    id: userInfo.inboxId,
    name: 'Inbox',
  });
};

/**
 * Update the max age a cached object can have before being refreshed
 * @param {Number} minutes - Maximum age in minutes
 */
TickTick.prototype.changeCacheMaxAge = function _changeCacheMaxAge(minutes) {
  conn._cacheMaxAgeInMinutes = minutes;
};

/**
 * List-related methods
 */

/**
 * Verify if the current lists cache has not expired. If it has expired, it will update
 * TickTick's list properties
 * @private
 */
TickTick.prototype._checkListsCache = async function _checkListsCache() {
  if (!utils.validateCache(this._listsCacheLastUpdate)) {
    const listsArray = await lists.getAll();
    for (let i = 0; i < listsArray.length; i += 1) {
      const current = listsArray[i];
      this._listsCache[current.name] = current;
    }

    this._listsCacheLastUpdate = new Date();
  }
};

/**
 * Gets a map of all lists available to the authenticated user
 * @param {boolean=} forceRefresh - Whether to force a refresh of the cached lists
 * @returns {Object.<string, List>} Object with cached user lists where the key is
 * the name of the list
 */
TickTick.prototype.getLists = async function _getLists(forceRefresh) {
  if (forceRefresh === true) {
    this._listsCacheLastUpdate = undefined;
  }

  await this._checkListsCache();
  return this._listsCache;
};

/**
 * Gets a list with a specific name
 * @param {string} name - The name of the list
 * @param {boolean=} forceRefresh - Whether to force a refresh of the cached lists
 * @returns {List|undefined}} {@link List} object or undefined if a list with the
 * provided name does not exist
 */
TickTick.prototype.getListByName = async function _getListByName(name, forceRefresh) {
  if (forceRefresh === true) {
    this._listsCacheLastUpdate = undefined;
  }

  await this._checkListsCache();
  return this._listsCache[name];
};


/**
 * Reminder-related properties
 */

/**
  * Creates a reminder object to be used when creating a {@link Task}. The reminder
  * will go off at {quantity} {units} before the date set for the {@link Task}.
  * If quantity equals to 0, an instant reminder will be returned
  * @param {Number} quantity - Quantity of unit.
  * @param {Reminder.TimeUnit} unit - Unit of time
  * @returns {Reminder} Reminder object that can be used to create a {@link Task}.
  */
TickTick.prototype.createReminder = function _createReminder(quantity, unit) {
  return new Reminder(quantity, unit);
};

/**
 * Access to connection
 * @private
 */
TickTick.prototype._conn = conn;

/**
 * Access to List model
 */
TickTick.prototype.List = List;

/**
 * Access to Task model
 */
TickTick.prototype.Task = Task;

/**
 * Access to Reminder model
 */
TickTick.prototype.Reminder = Reminder;

/**
 * Access to Tasks methods
 */
TickTick.prototype.tasks = tasks;

/**
 * Access to Lists methods
 */
TickTick.prototype.lists = lists;

const tickTick = new TickTick();
module.exports = tickTick;
