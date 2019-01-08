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

const loginEmail = async function loginEmail(/* credentials */) {
  throw new UnavailableProviderError('Email');
};

const loginFacebook = async function loginFacebook(/* credentials */) {
  throw new UnavailableProviderError('Facebook');
};

const loginGoogle = async function loginGoogle(/* credentials */) {
  throw new UnavailableProviderError('Google');
};

const loginTwitter = async function loginTwitter(/* credentials */) {
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
  },
};
