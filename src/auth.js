const conn = require('./connection');

class NotLoggedInError extends Error {
  constructor() {
    super('A login is necessary before performing any actions');
    this.name = 'NotLoggedInError';
  }
}

class NoLoginProviderSelectedError extends Error {
  constructor() {
    super('The "ptions" parameter does not contain valid data for any provider');
    this.name = 'NoLoginProviderSelectedError';
  }
}

class UnavailableLoginProviderError extends Error {
  constructor(provider) {
    super(`The handler for ${provider} login is not implemented`);
    this.name = 'UnavailableProviderError';
  }
}

class FailedLoginError extends Error {
  constructor(message, errorId, errorCode, errorMessage) {
    super(message);
    this.errorId = errorId;
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }
}

const assertLogin = function _assertLoginMiddleware() {
  const cookies = conn.cookieJar.getCookies(conn.baseUri);

  for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].key === 't' && cookies[i].expires > Date.now()) {
      return;
    }
  }

  throw new NotLoggedInError();
};

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

const loginFacebook = async function _loginFacebook(/* credentials */) {
  throw new UnavailableLoginProviderError('Facebook');
};

const loginGoogle = async function _loginGoogle(/* credentials */) {
  throw new UnavailableLoginProviderError('Google');
};

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
