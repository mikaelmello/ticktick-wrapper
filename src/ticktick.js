const rp = require('request-promise');
const auth = require('./auth');

function TickTick() {
  this.cookieJar = rp.jar();
  this.request = rp.defaults({
    jar: this.cookieJar, // In order to keep authentication cookie ('t') inside jar
  });
  this.baseUri = 'https://api.ticktick.com/api/v2';
  this.user = {};
}

TickTick.prototype.login = async function _login(options) {
  if (!options) {
    throw new auth.errors.NoLoginProviderSelectedError();
  }

  let userInfo;
  if (options.email) {
    userInfo = await auth.loginEmail.call(this, options.email);
  } else if (options.google) {
    userInfo = await auth.loginGoogle.call(this, options.google);
  } else if (options.facebook) {
    userInfo = await auth.loginFacebook.call(this, options.facebook);
  } else if (options.twitter) {
    userInfo = await auth.loginTwitter.call(this, options.twitter);
  } else {
    throw new auth.errors.NoLoginProviderSelectedError();
  }

  this._setUserInfo(userInfo);
};

TickTick.prototype._setUserInfo = function _setUserInfo(userInfo) {
  this.user.username = userInfo.username;
  this.user.inboxId = userInfo.inboxId;
  this.user.isPro = userInfo.pro;
  this.user.id = userInfo.userId;
};

TickTick.prototype._assertLogin = function _assertLogin() {
  const cookies = this.cookieJar.getCookies(this.baseUri);

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].key === 't' && cookies[i].expires > Date.now()) {
      return;
    }
  }

  throw auth.errors.NotLoggedInError();
};

TickTick.prototype.getWhatever = async function _getWhatever() {
  this._assertLogin();
  const options = {
    // uri: `${this.baseUri}/task/?projectId=5c0eee65e4b00d057d2e5499`,
    uri: `${this.baseUri}/projects/`,
    json: true,
  };

  try {
    const userInfo = await this.request(options);
    console.log(userInfo);
  } catch (err) {
    const { body } = err.response;
    console.log(body);
  }
};

module.exports = new TickTick();
