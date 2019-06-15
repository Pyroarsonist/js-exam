/* eslint-disable no-underscore-dangle */
import { bot } from 'core/telegram';
import debugHandler from 'debug';
import userMiddleware from './userMiddleware';
import noteCommand from './noteCommand';

const debug = debugHandler('exam:commands');

export default () => {
  bot.catch(err => {
    debug(err);
  });

  bot.use(userMiddleware);

  noteCommand(bot);
  // bot.command('addNode', noteCommand);

  bot.command('start', async ctx =>
    ctx.reply('Привет! Ты можешь добавить новые записки или изменить старые!'),
  );
};
