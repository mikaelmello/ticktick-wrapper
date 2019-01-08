class NoProviderSelectedError extends Error {
  constructor() {
    super('The "ptions" parameter does not contain valid data for any provider');
    this.name = 'NoProviderSelectedError';
  }
}

class UnavailableProviderError extends Error {
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

const loginEmail = async function _loginEmail(credentials) {
  const options = {
    method: 'POST',
    uri: `${this.baseUri}/user/signon`,
    qs: {
      wc: true,
      remember: true,
    },
    json: true,
    body: credentials,
  };

  try {
    await this.request(options);
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
  throw new UnavailableProviderError('Facebook');
};

const loginGoogle = async function _loginGoogle(/* credentials */) {
  throw new UnavailableProviderError('Google');
};

const loginTwitter = async function _loginTwitter(/* credentials */) {
  throw new UnavailableProviderError('Twitter');
};

module.exports = {
  email: loginEmail,
  facebook: loginFacebook,
  google: loginGoogle,
  twitter: loginTwitter,
  errors: {
    UnavailableProviderError,
    NoProviderSelectedError,
    FailedLoginError,
  },
};
