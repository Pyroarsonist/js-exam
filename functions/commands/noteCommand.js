const TelegrafInlineMenu = require('telegraf-inline-menu');

let db = null;

const menu = new TelegrafInlineMenu('Редактор записок');
const replyMiddleware = menu.replyMenuMiddleware();

const separator = ':pyro:'

const subMenu = new TelegrafInlineMenu(() => 'Выберите, что делать с запиской');
// subMenu.simpleButton('Редактировать', 'edit', {
//   questionText: 'Новый текст',
//   setFunc: async ctx => {
//     const text = ctx.match[1];
//     const w = await db
//       .collection('notes')
//       .where('text', '==', text)
//       .get();
//     w.forEach(async x => {
//       if (x) {
//         await db
//           .collection('notes')
//           .doc(x.id)
//           .update({
//             text: 's',
//           });
//       }
//     });
//     await ctx.reply('Сохранено!');
//     replyMiddleware.setSpecific(ctx, 'main');
//   },
// });

subMenu.simpleButton('Удалить', 'del', {
  doFunc: async ctx => {
    const id = ctx.match[1].split(separator)[0]
    const w = await db
      .collection('notes')
      .where('text', '==', text)
      .get();
    w.forEach(async x => {
      if (x) {
        await db
          .collection('notes')
          .doc(x.id)
          .delete();
      }
    });
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
      // if (x) notes.push({ ...x.data(), id: x.id });
      if (x) notes.push([x.id,x.data().text].join(separator));
    });
    return notes;
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
