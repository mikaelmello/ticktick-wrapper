const conn = require('./connection');
const utils = require('./utils');
const auth = require('./auth');
const List = require('./list');
const Reminder = require('./reminder');

function TickTick() {
  conn.addMiddleware(auth.assertLogin);
  this.user = {};

  this._listsCache = {};
  this._listsCacheLastUpdate = undefined;
  this._cacheMaxAgeInMinutes = 10;
}

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

TickTick.prototype._setUserInfo = function _setUserInfo(userInfo) {
  this.user._inboxId = userInfo.inboxId;

  this.user.username = userInfo.username;
  this.user.isPro = userInfo.pro;
  this.user.id = userInfo.userId;
  this.Inbox = new List({
    id: userInfo._inboxId,
    name: 'Inbox',
  });
};

TickTick.prototype.changeCacheMaxAge = function _changeCacheMaxAge(minutes) {
  this._cacheMaxAgeInMinutes = minutes;
};

/**
 * List-related methods
 */

TickTick.prototype._checkListsCache = async function _checkListsCache() {
  if (!utils.validateCache(this._listsCacheLastUpdate, this._cacheMaxAgeInMinutes)) {
    const listsArray = await List._getAll();
    for (let i = 0; i < listsArray.length; i += 1) {
      const current = listsArray[i];
      this._listsCache[current.name] = current;
    }

    this._listsCacheLastUpdate = new Date();
  }
};

TickTick.prototype.getLists = async function _getLists(forceRefresh) {
  if (forceRefresh === true) {
    this._listsCacheLastUpdate = undefined;
  }

  await this._checkListsCache();
  return this._listsCache;
};

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

TickTick.prototype.createReminder = function _createReminder(quantity, unit) {
  return Reminder._create(quantity, unit);
};

const tickTick = new TickTick();
module.exports = tickTick;
