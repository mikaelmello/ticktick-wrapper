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

  if (options.email) {
    return auth.loginEmail.call(this, options.email);
  }

  if (options.google) {
    return auth.loginGoogle.call(this, options.google);
  }

  if (options.facebook) {
    return auth.loginFacebook.call(this, options.facebook);
  }

  if (options.twitter) {
    return auth.loginTwitter.call(this, options.twitter);
  }

  throw new auth.errors.NoLoginProviderSelectedError();
};

TickTick.prototype._authMiddleware = function _authMiddleware() {
  const cookies = this.cookieJar.getCookies(this.baseUri);

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].key === 't' && cookies[i].expires > Date.now()) {
      return;
    }
  }

  throw auth.errors.NotLoggedInError();
};

module.exports = new TickTick();
