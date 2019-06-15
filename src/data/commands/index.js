/* eslint-disable no-underscore-dangle */
import { bot } from 'core/telegram';
import debugHandler from 'debug';
import session from 'telegraf/session';
import userMiddleware from './userMiddleware';
import noteCommand from './noteCommand';

const debug = debugHandler('exam:commands');

export default () => {
  bot.catch(err => {
    debug(err);
  });

  bot.use(session());

  bot.use(userMiddleware);

  noteCommand(bot);
};
