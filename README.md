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

## Description

This library aims to delay process exit by a configurable amount of time to let service/traffic orchestrator to stop routing active traffic so that the process can be killed safely.

1. `SIGINT`, `SIGTERM` and `uncaughtException` signals
2. start a timer with `shutdownDelay` after catching one of the signals above.
3. fire an event with `NEXIT_SHUTDOWN` to let application know about the state
> application can use this event for its `healthz` route as below.
4. once `shutdownDelay` timer is expired, start a new timer with `exitDelay`
5. fire an event with `NEXIT_EXIT` to let application know about the state
6. at this point, application may exit on its own at any time if node event loop is fully cleared
7. once `exitDelay` timer is expired, application will be killed forcefully by `process.exit` command

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
