import { db } from 'core/db';

export default async (ctx, next) => {
  const collection = db.collection('users');
  const {
    id,
    first_name,
    is_bot,
    language_code,
    last_name,
    username,
  } = ctx.from;
  const userData = {
    telegramId: id,
    firstName: first_name,
    isBot: is_bot,
    languageCode: language_code,
    lastName: last_name,
    userName: username,
  };

  const user = await collection.doc(`${id}`);
  await user.update(userData, { merge: true });
  ctx.user = userData;
  return next(ctx);
};
