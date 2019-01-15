/** @module Authentication */

const conn = require('./connection');

/**
 * Error thrown when the client tries to call any function that requires authentication
 * before authenticating.
 * @class
 * @ignore
 */
class NotLoggedInError extends Error {
  constructor() {
    super('A login is necessary before performing any actions');
    this.name = 'NotLoggedInError';
  }
}

/**
 * Error thrown when the parameters in a call to {@link TickTick#login} do not match any
 * valid provider.
 * @class
 * @ignore
 */
class NoLoginProviderSelectedError extends Error {
  constructor() {
    super('The "ptions" parameter does not contain valid data for any provider');
    this.name = 'NoLoginProviderSelectedError';
  }
}

/**
 * Error thrown when the client tries to perform a login using a provider that is not yet
 * supported.
 * @class
 * @ignore
 */
class UnavailableLoginProviderError extends Error {
  constructor(provider) {
    super(`The handler for ${provider} login is not implemented`);
    this.name = 'UnavailableProviderError';
  }
}

/**
 * Error thrown when a login request fails
 * @class
 * @ignore
 * @param {string} message - Error message
 * @param {string} errorId - Error id returned by the failed request
 * @param {string} errorCode - Error code returned by the failed request
 * @param {string} errorMessage - Error message returned by the failed request
 */
class FailedLoginError extends Error {
  constructor(message, errorId, errorCode, errorMessage) {
    super(message);
    this.errorId = errorId;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

/**
 * Middleware to be executed before each request that ensures the client has already
 * authenticated before calling any methods
 * @private
 * @throws {NotLoggedInError} If the client has not authenticated
 */
const assertLogin = function _assertLoginMiddleware() {
  const cookies = conn.cookieJar.getCookies(conn.baseUri);

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].key === 't' && cookies[i].expires > Date.now()) {
      return;
    }
  }

  throw new NotLoggedInError();
};

/**
 * Executes a login operation via e-mail, using an e-mail and a password.
 * @private
 * @param {Object} credentials - Credentials used on login
 * @param {string} credentials.username - E-mail of the account
 * @param {string} credentials.password - Password of the account
 * @throws {FailedLoginError} If the request fails
 */
const loginEmail = async function _loginEmail(credentials) {
  const options = {
    method: 'POST',
    uri: `${conn.baseUri}/user/signon`,
    qs: {
      wc: true,
      remember: true,
    },
    json: true,
    body: credentials,
  };

  try {
    const userInfo = conn.request(options);
    return userInfo;
  } catch (err) {
    const { body } = err.response;
    switch (body.errorCode) {
      case 'username_not_exist':
        throw new FailedLoginError(`The username "${credentials.username}" does not exist`,
          body.errorId, body.errorCode, body.errorMessage);
      case 'username_password_not_match':
        throw new FailedLoginError(`The password provided for the username "${credentials.username}"`
          + ' is incorrect', body.errorId, body.errorCode, body.errorMessage);
      default:
        throw new FailedLoginError('Error on login', body.errorId, body.errorCode,
          body.errorMessage);
    }
  }
};

/**
 * Not implemented
 * @private
 * @throws {UnavailableLoginProviderError}
 */
const loginFacebook = async function _loginFacebook(/* credentials */) {
  throw new UnavailableLoginProviderError('Facebook');
};

/**
 * Not implemented
 * @private
 * @throws {UnavailableLoginProviderError}
 */
const loginGoogle = async function _loginGoogle(/* credentials */) {
  throw new UnavailableLoginProviderError('Google');
};

/**
 * Not implemented
 * @private
 * @throws {UnavailableLoginProviderError}
 */
const loginTwitter = async function _loginTwitter(/* credentials */) {
  throw new UnavailableLoginProviderError('Twitter');
};

module.exports = {
  loginEmail,
  loginFacebook,
  loginGoogle,
  loginTwitter,
  assertLogin,
  errors: {
    NotLoggedInError,
    UnavailableLoginProviderError,
    NoLoginProviderSelectedError,
    FailedLoginError,
  },
};
