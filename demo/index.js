const express = require('express');
const Nexit = require('nexit');

const app = express();

const nexit = new Nexit.Nexit();
nexit.on(Nexit.NEXIT_SHUTDOWN, (error, signal) => {
  console.log(`server is shutting down with signal: ${signal}`, error);
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
