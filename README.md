# TickTick Wrapper for Node

This package is meant to be a wrapper that allows you to automate your actions on TickTick.

It calls the **undocumented API**, used by the web app, that can change at any time, use with caution.

## Getting started

Install the package by executing:

```
npm install -s ticktick-wrapper
```

### Example

```
const ticktick = require('ticktick-wrapper');

const main = async () => {
  await ticktick.login({
    email: {
      username: 'username',
      password: 'password',
    },
  });

  const title = 'Automated task';
  const description = 'This is a task added programatically via ticktick-wrapper';
  await ticktick.Inbox.addSimpleTask(title, description);
};

main();
```

### Documentation

Documentation and the API can be found [here](https://mikaelmello.github.io/ticktick-wrapper)
