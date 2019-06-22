const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Telegraf = require('telegraf');

const commands = require('./commands').default;

console.info('Starting telegram bot', new Date().toISOString());

admin.initializeApp(functions.config().firebase);

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || functions.config().bot.token;

const bot = new Telegraf(BOT_TOKEN);

const db = admin.firestore();

commands(bot, db);

if (process.env.TELEGRAM_BOT_TOKEN) bot.startPolling();

module.exports = async (req, res) => {
  const t = new Date().getTime();
  console.info(req.body);
  try {
    await bot.handleUpdate(req.body, res);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
  const tt = new Date().getTime();
  console.info(`${tt - t} ms for request`);
  try {
    res.end();
  } catch (e) {
    //
  }
};
