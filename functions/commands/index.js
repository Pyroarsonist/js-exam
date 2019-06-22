const session = require('telegraf/session');
const userMiddleware = require('./userMiddleware').default;
const noteCommand = require('./noteCommand').default;
const dotabuff = require('./dotabuff').default;

exports.default = (bot, db) => {
  bot.catch(err => {
    console.error(err);
  });

  bot.use(session());

  bot.use((ctx, next) => userMiddleware(db, ctx, next));

  bot.command('start', ctx => ctx.reply(`Привет, @${ctx.user.userName}!`));
  bot.command('time', ctx => ctx.reply(new Date().toISOString()));

  dotabuff(bot, db);
  noteCommand(bot, db);
};
