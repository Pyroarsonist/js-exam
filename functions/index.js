require('dotenv').config();
const functions = require('firebase-functions');
const bot = require('./bot');

exports.bot = functions.https.onRequest(bot);
