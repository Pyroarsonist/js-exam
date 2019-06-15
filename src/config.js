import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line import/prefer-default-export
export const token = process.env.TELEGRAM_BOT_TOKEN;

// eslint-disable-next-line no-underscore-dangle
global.__DEV__ = process.env.NODE_ENV !== 'production';
