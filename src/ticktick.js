const conn = require('./connection');
const auth = require('./auth');
const List = require('./list');
const Reminder = require('./reminder');

function TickTick() {
  this.user = {};
}

TickTick.prototype.login = async function _login(options) {
  if (!options) {
    throw new auth.errors.NoLoginProviderSelectedError();
  }

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

TickTick.prototype._assertLogin = function _assertLogin() {
  const cookies = conn.cookieJar.getCookies(conn.baseUri);

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].key === 't' && cookies[i].expires > Date.now()) {
      return;
    }
  }

  throw auth.errors.NotLoggedInError();
};

TickTick.prototype.getLists = async function _getLists() {
  this._assertLogin();
  return List._getAll();
};

TickTick.prototype.createReminder = function _createReminder(quantity, unit) {
  return Reminder._create(quantity, unit);
};

const tickTick = new TickTick();
module.exports = tickTick;
