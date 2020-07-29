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
  const lists = await ticktick.lists.getAll();
  console.log(lists);
  const tasks = await ticktick.tasks.getUncompleted();

  console.log(lists);
  console.log(tasks.map(t => t.title));
};

main();
