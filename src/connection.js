const rp = require('request-promise');

const baseUri = 'https://api.ticktick.com/api/v2';

const cookieJar = rp.jar();

const request = rp.defaults({
  jar: cookieJar, // In order to keep authentication cookie ('t') inside jar
});

module.exports = {
  baseUri,
  cookieJar,
  request,
};
