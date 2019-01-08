require('dotenv').config();
const ticktick = require('./index');

ticktick.login({
  email: {
    username: process.env.EMAIL_LOGIN_USERNAME,
    password: process.env.EMAIL_LOGIN_PASSWORD,
  },
});
