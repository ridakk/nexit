# nexit

[![Build Status](https://travis-ci.org/ridakk/nexit.svg?branch=master)](https://travis-ci.org/ridakk/nexit)
[![Coverage Status](https://coveralls.io/repos/github/ridakk/nexit/badge.svg?branch=master)](https://coveralls.io/github/ridakk/nexit?branch=master)

***Zero Dependency*** utility to exit NodeJs gracefully

## Install

```bash
npm install nexit
```

## API

Constructor parameters

| Parameter | Default | Description |
| ----------- | ----------- | ----------- |
| options.shutdownDelay | 30000 | shutdown delay(ms) |
| options.exitDelay | 300 | exit delay(ms) |

## Quick Start

```js
const Nexit = require('nexit');

new Nexit.Nexit();
```

or

```js
import { Nexit } from 'nexit';

new Nexit();
```

## Usage

Simple `healthz` route implementation for ExpressJs.

```js
const express = require('express');
const Nexit = require('nexit');

const app = express();

const nexit = new Nexit.Nexit();
nexit.on(Nexit.NEXIT_SHUTDOWN, () => {
  console.log('server is shutting down...');
  app.set('isShuttingDown', true);
});
nexit.on(Nexit.NEXIT_EXIT, () => {
  console.log('server is exiting...');
});

app.get('/healthz', (req, res) => {
  const isShuttingDown = app.get('isShuttingDown');

  if (isShuttingDown) {
    res.status(503).send({
      message: 'shutting down',
    });
    return;
  }

  res.status(200).send({
    message: 'ok',
  });
});

app.listen(8080);
```

See `./demo` for a working example;

```bash
cd ./demo
npm install
node index.js
```
