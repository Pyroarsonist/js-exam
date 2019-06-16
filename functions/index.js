require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Telegraf = require('telegraf');

const commands = require('./commands').default;

console.info('Starting telegram bot');

admin.initializeApp(functions.config().firebase);

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || functions.config().bot.token;

const bot = new Telegraf(BOT_TOKEN);

const db = admin.firestore();

commands(bot, db);

if (process.env.TELEGRAM_BOT_TOKEN) bot.startPolling();

exports.bot = functions.https.onRequest(async (req, res) =>
  bot.handleUpdate(req.body, res),
);

console.info('Telegram bot started');
