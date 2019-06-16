const TelegrafInlineMenu = require('telegraf-inline-menu');
const _ = require('lodash');

let db = null;

const menu = new TelegrafInlineMenu('Редактор записок');
const replyMiddleware = menu.replyMenuMiddleware();

const separator = 'xpyrox';

const subMenu = new TelegrafInlineMenu(() => 'Выберите, что делать с запиской');

subMenu.simpleButton('Удалить', 'del', {
  doFunc: async ctx => {
    const id = ctx.match[1].split(separator)[0];
    await db
      .collection('notes')
      .doc(id)
      .delete();
    await ctx.reply('Удалено!');
    replyMiddleware.setSpecific(ctx, 'main');
  },
});

menu.selectSubmenu(
  'main',
  async ctx => {
    const notes = [];
    const notesQuery = await db
      .collection('notes')
      .where('ownerId', '==', ctx.user.telegramId)
      .get();
    notesQuery.forEach(x => {
      if (x) {
        const data = x.data();
        notes.push({
          text: [x.id, x.data().text].join(separator),
          createdAt: data.createdAt,
        });
      }
    });
    return _.sortBy(notes, 'createdAt').map(x => x.text);
  },
  subMenu,
  {
    textFunc: (_ctx, note) => note.split(separator)[1],
    columns: 4,
  },
);

menu.question('Добавить записку', 'add', {
  questionText: 'Новая записка',
  setFunc: async (ctx, key) => {
    await db.collection('notes').add({
      text: key,
      ownerId: ctx.user.telegramId,
      createdAt: new Date().toISOString(),
    });
  },
});

menu.setCommand('start');

exports.default = (bot, database) => {
  db = database;
  bot.use(
    menu.init({
      backButtonText: 'Назад',
      mainMenuButtonText: 'Назад в главное меню',
    }),
  );
};
