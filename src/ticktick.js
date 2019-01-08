const rp = require('request-promise');
const login = require('./login');

function TickTick() {
  this.request = rp.defaults({
    jar: true,
  });
  this.baseUri = 'https://api.ticktick.com/api/v2';
}

TickTick.prototype.login = async function _login(options) {
  if (!options) {
    throw new Error('No options provided for login');
  }

  if (options.email) {
    return login.email.call(this, options.email);
  }

  if (options.google) {
    return login.google.call(this, options.google);
  }

  if (options.facebook) {
    return login.facebook.call(this, options.facebook);
  }

  if (options.twitter) {
    return login.twitter.call(this, options.twitter);
  }

  throw new Error('No options provided for login');
};

module.exports = new TickTick();
