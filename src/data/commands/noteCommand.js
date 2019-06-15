// import debugHandler from 'debug';
import TelegrafInlineMenu from 'telegraf-inline-menu';

// const Telegraf = require('telegraf')
// const Composer = require('telegraf/composer')
// const session = require('telegraf/session')
// const Stage = require('telegraf/stage')
// const Markup = require('telegraf/markup')
// const WizardScene = require('telegraf/scenes/wizard')
//
// const stepHandler = new Composer()
// stepHandler.action('next', (ctx) => {
//   ctx.reply('Step 2. Via inline button')
//   return ctx.wizard.next()
// })
// stepHandler.command('next', (ctx) => {
//   ctx.reply('Step 2. Via command')
//   return ctx.wizard.next()
// })
// stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))
//
// const superWizard = new WizardScene('super-wizard',
//   (ctx) => {
//     ctx.reply('Step 1', Markup.inlineKeyboard([
//       Markup.urlButton('❤️', 'http://telegraf.js.org'),
//       Markup.callbackButton('➡️ Next', 'next')
//     ]).extra())
//     return ctx.wizard.next()
//   },
//   stepHandler,
//   (ctx) => {
//     ctx.reply('Step 3')
//     return ctx.wizard.next()
//   },
//   (ctx) => {
//     ctx.reply('Step 4')
//     return ctx.wizard.next()
//   },
//   (ctx) => {
//     ctx.reply('Done')
//     return ctx.scene.leave()
//   }
// )
//
// const stage = new Stage([superWizard], { default: 'super-wizard' })

// const debug = debugHandler('exam:commands:note-command');

const startMenu = new TelegrafInlineMenu(
  ctx =>
    `Привет, ${
      ctx.user.firstName
    }! Ты можешь добавить новые записки или изменить старые!`,
);
// const createMenu = new TelegrafInlineMenu(ctx => 'Создаем новую записку');
// const readMenu = new TelegrafInlineMenu(ctx => 'Показываем все записки');
// const editMenu = new TelegrafInlineMenu(ctx => 'Редактируем записку');
// const deleteMenu = new TelegrafInlineMenu(ctx => 'Удаляем записку');

startMenu.question('Создать новую записку', 'cr', {
  questionText: 'Введите заголовок записки',
  setFunc: async (ctx, key) => ctx.reply(`Вы вписали ${key}`),
  joinLastRow: true,
});
// .question('кек', 'sdsd', {
//   questionText: 'c2',
//   setFunc: async (ctx, key) => ctx.reply(`Вы выбрали2 ${key}`),
//   joinLastRow: true,
// });
// startMenu.submenu('Создать новую записку', 'c', createMenu);
// startMenu.submenu('Показать все записки', 'r', readMenu);
// startMenu.submenu('Редакактировать записку', 'e', editMenu);
// startMenu.submenu('Удалить записку', 'd', deleteMenu);
//
startMenu.setCommand('start');

export default bot => {
  // bot.use(session());
  // bot.use(stage.middleware());
  // bot.launch()
  bot.use(startMenu.init());
};
