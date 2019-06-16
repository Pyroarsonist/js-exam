exports.default = async (db, ctx, next) => {
  const collection = db.collection('users');
  const { id, first_name, is_bot, last_name, username } = ctx.from;
  const userData = {
    telegramId: id,
    firstName: first_name || null,
    isBot: !!is_bot,
    lastName: last_name || null,
    userName: username || null,
  };

  const user = await collection.doc(`${id}`);
  await user.update(userData, { merge: true });
  ctx.user = userData;

  console.info(
    `User is ${userData.firstName} ${userData.lastName} or @${userData.userName}`,
  );
  return next(ctx);
};
