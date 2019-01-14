const rp = require('request-promise');

const baseUri = 'https://api.ticktick.com/api/v2';

const cookieJar = rp.jar();

const rpDefaults = rp.defaults({
  jar: cookieJar, // In order to keep authentication cookie ('t') inside jar
});

let middlewares = {};

const request = function _request(...args) {
  for (let name in middlewares) { // eslint-disable-line
    if (typeof middlewares[name] === 'function') {
      middlewares[name](...args);
    }
  }

  return rpDefaults(...args);
};

const addMiddleware = function _addMiddleware(callback) {
  if (typeof callback === 'function') {
    middlewares[callback.name] = callback;
  } else {
    throw new Error('Callback passed as parameter is not a function');
  }
};

const removeMiddleware = function _removeMiddleware(callback) {
  if (typeof callback === 'function') {
    delete middlewares[callback.name];
  } else {
    delete middlewares[callback];
  }
};

const clearMiddlewares = function _clearMiddlewares() {
  middlewares = {};
};

module.exports = {
  baseUri,
  cookieJar,
  request,
  addMiddleware,
  removeMiddleware,
  clearMiddlewares,
};
