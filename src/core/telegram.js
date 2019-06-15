import Telegraf from 'telegraf';
import debugHandler from 'debug';
import commands from '../data/commands';
import { token } from '../config';

const debug = debugHandler('exam:telegram');

// eslint-disable-next-line import/no-mutable-exports
let bot = null;
export default async () => {
  if (!token) {
    throw new Error('No telegram bot key supplied');
  }
  try {
    debug('Initializing telegram bot');
    bot = new Telegraf(token, { username: 'dopka_bot' });

    // loading commands

    commands();

    bot.startPolling();
    debug('Started with polling');
  } catch (e) {
    console.error(e);
  }
};

export { bot };
