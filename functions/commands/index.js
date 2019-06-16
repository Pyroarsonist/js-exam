const session = require('telegraf/session');
const userMiddleware = require('./userMiddleware').default;
const noteCommand = require('./noteCommand').default;

exports.default = (bot, db) => {
  bot.catch(err => {
    console.error(err);
  });

  bot.use(session());

  bot.use((ctx, next) => userMiddleware(db, ctx, next));

  noteCommand(bot, db);
};
