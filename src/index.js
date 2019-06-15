import debugHandler from 'debug';
import initDB from 'core/db';
import telegram from './core/telegram';

const debug = debugHandler('exam:index');

process
  .on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    console.error(err.stack);
    process.exit(1);
  });

const promise = initDB()
  .then(telegram)
  .catch(err => debug(err.stack));

promise.then(() => {
  // init server
});
