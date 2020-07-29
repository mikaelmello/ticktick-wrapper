/** @module TickTick */

const conn = require('./connection');
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
class TickTick {
  constructor() {
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
     * Access to connection
     * @private
     */
    this._conn = conn;

    /**
     * Access to List model
     */
    this.List = List;

    /**
     * Access to Task model
     */
    this.Task = Task;

    /**
     * Access to Reminder model
     */
    this.Reminder = Reminder;

    /**
     * Access to Tasks methods
     */
    this.tasks = tasks;

    /**
     * Access to Lists methods
     */
    this.lists = lists;
  }

  /**
   * Authenticate with TickTick and store the session info for future calls.
   * This method must be called *before* any other.
   * @param {Object} options - Login options
   * @param {Object=} options.email - Object that must exist if the login is done via email
   * @param {string} options.email.username - Your TickTick's account e-mail
   * @param {string} options.email.password - Your TickTick's account password
   */
  async login(options) {
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
  }

  /**
   * Stores local information about the authenticated user
   * @private
   * @param {Object} userInfo - User Innformation
   * @param {string} userInfo.inboxId - Id of the authenticated ser's Inbox list
   * @param {string} userInfo.username - Authenticated user's username
   * @param {string} userInfo.id - Account ID of the authenticated user
   * @param {boolean} userInfo.pro - Whether the authenticated user has a pro account
   */
  _setUserInfo(userInfo) {
    this.user.username = userInfo.username;
    this.user.isPro = userInfo.pro;
    this.user.id = userInfo.userId;
    this.Inbox = new List({
      id: userInfo.inboxId,
      name: 'Inbox',
    });
  }

  /**
   * Update the max age a cached object can have before being refreshed
   * @param {Number} minutes - Maximum age in minutes
   */
  changeCacheMaxAge(minutes) {
    conn._cacheMaxAgeInMinutes = minutes;
  }

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
  createReminder(quantity, unit) {
    return new Reminder(quantity, unit);
  }
}

const tickTick = new TickTick();
module.exports = tickTick;
