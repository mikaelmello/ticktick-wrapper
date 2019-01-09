/* eslint no-console: 0 */

require('dotenv').config();
const ticktick = require('./index');

const main = async () => {
  await ticktick.login({
    email: {
      username: process.env.EMAIL_LOGIN_USERNAME,
      password: process.env.EMAIL_LOGIN_PASSWORD,
    },
  });

  await ticktick.addSimpleTask('oi', '2');
};

main();
