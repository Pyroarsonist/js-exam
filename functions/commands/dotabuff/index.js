const processMatchParse = require('./processMatchParse').default;

exports.default = (bot, db) => {
  bot.hears(
    /\/dotabuff(?: )*(parse(?: )*(\d+)*|stats(?: )*(\w+)*)*/,
    async ctx => {
      if (!ctx.match[1])
        return ctx.reply('Используйте parse matchId или stats команду');
      const command = ctx.match[1];
      if (command.includes('parse')) {
        const id = ctx.match[2];
        if (!id) return ctx.reply('Введите id после parse');
        await processMatchParse(id, db);
        return ctx.reply(`Матч #${id} спаршен удачно`);
      }
      // if (command.includes('get')) {
      //   const id = ctx.match[2];
      //   if (!id) return ctx.reply('Введите id после get');
      //   const match = await db
      //     .collection('dotabuffMatches')
      //     .doc(`${id}`)
      //     .get();
      //   if (match.exists) {
      //     const data = match.data();
      //     return ctx.reply(JSON.stringify(data));
      //   }
      //   return ctx.reply('Нету данных по этому матчу');
      // }
      if (command.includes('stats')) {
        const retStr = 'Используйте kills'; // add another
        const attribute = ctx.match[3];
        if (!attribute) return ctx.reply(retStr);
        if (attribute.trim() === 'kills') {
          const killsRef = await db
            .collection('dotabuffStats')
            .doc('kills')
            .get();
          if (killsRef.exists) {
            const data = killsRef.data();
            return ctx.reply(
              `Общее кол-во киллов - ${data.kills}\n` +
                `Матчи, которые были задействованы - ${data.matches.join(',')}`,
            );
          }
          return ctx.reply('Нету данных по киллам');
        }
        return ctx.reply(retStr);
      }
      return ctx.reply('Команда не распознана');
    },
  );
};
