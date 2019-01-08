const rp = require('request-promise');
const login = require('./login');

function TickTick() {
    this.request = rp.defaults({
        jar: true,
    });
    this.baseUri = 'https://api.ticktick.com/api/v2';
}

TickTick.prototype.login = async function(options) {    
    if (!options) {
        throw new Error('No options provided for login');
    }

    if (options.email) {
        await login.email.call(this, options.email);
    } else if (options.google) {
        await login.google.call(this, options.google);
    } else if (options.facebook) {
        await login.facebook.call(this, options.facebook);
    } else if (options.twitter) {
        await login.twitter.call(this, options.twitter);
    } else {
        throw new Error('No options provided for login');
    }
}

module.exports = exports = new TickTick();
