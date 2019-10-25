import express from 'express';
import { Nexit, NEXIT_EXIT, NEXIT_SHUTDOWN } from 'nexit';

const app = express();

console.log(Nexit);

const nexit = new Nexit();
nexit.on(NEXIT_SHUTDOWN, () => {
  console.log('server is shutting down...');
  app.set('isShuttingDown', true);
});
nexit.on(NEXIT_EXIT, () => {
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
