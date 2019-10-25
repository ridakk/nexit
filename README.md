# nexit

[![Build Status](https://travis-ci.org/ridakk/nexit.svg?branch=master)](https://travis-ci.org/ridakk/nexit)
[![Coverage Status](https://coveralls.io/repos/github/ridakk/nexit/badge.svg?branch=master)](https://coveralls.io/github/ridakk/nexit?branch=master)

***Zero Dependency*** utility to exit NodeJs gracefully

## Install

```bash
npm install graceful
```

## API

Constructor parameters

| Parameter | Default | Description |
| ----------- | ----------- | ----------- |
| options.shutdownDelay | 30000 | shutdown delay(ms) |
| options.exitDelay | 300 | exit delay(ms) |

## Usage

Simple `healthz` route implementation for ExpressJs.

```js
const express = require('express');
const Nexit =  require('nexit');

var app = express()

const nexit = new Nexit();
nexit.on('NEXIT_SHUTDOWN', () => {
    console.log('server is shutting down...')
    app.set('isShuttingDown', true);
});
nexit.on('NEXIT_EXIT', () => {
    console.log('server is exiting...')
});

app.get(/healthz, (req, res) => {
    const isShuttingDown = app.get('isShuttingDown');

    if (isShuttingDown) {
      response.status(503).send({
        message: 'shutting down',
      });
      return;
    }

    response.status(200).send({
      message: 'ok',
    });
})

var server = app.listen(8080);
```
