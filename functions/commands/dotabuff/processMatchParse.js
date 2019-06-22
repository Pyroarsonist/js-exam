const cheerio = require('cheerio');
const parse = require('./parse').default;

// delete
// const fs = require('fs');
// const util = require('util');

// const readFile = util.promisify(fs.readFile);

const parsePlayer = ($, elem, isTrueSight) => {
  let player = {};

  const dataArray = $(elem)
    .find('td')
    .toArray();

  if (isTrueSight) dataArray.splice(1, 2);
  dataArray.splice(1, 2);
  dataArray.splice(6, 1);
  dataArray.splice(8, 1);

  dataArray.forEach((tdElem, tdIndex) => {
    const getRawValue = () => {
      const rawValue = $(tdElem)
        .html()
        .trim();
      const spanValue = $(tdElem)
        .find('span')
        .html();
      return spanValue || rawValue;
    };
    const getNumValue = () => +getRawValue() || 0;
    const getKValue = () => {
      const e = $(tdElem)
        .find('acronym')
        .html();
      const rawValue = getRawValue();
      let value = $(e).html() || e || $(rawValue).text() || rawValue;
      if (value && value.includes('k')) value = 1000 * value.split('k')[0];
      return +value || 0;
    };

    const resolvers = [
      () => {
        const pl = {};
        pl.heroName = $(elem)
          .find('a > img')
          .attr('title');
        pl.level = +$(elem)
          .find('a > span')
          .html()
          .trim();
        return pl;
      },
      () => ({ kills: getNumValue() }),
      () => ({ deaths: getNumValue() }),
      () => ({ assists: getNumValue() }),
      () => ({ networth: getKValue() }),
      () => ({ lastHits: getNumValue() }),
      () => ({ denies: getNumValue() }),
      () => ({ gpm: getNumValue() }),
      () => ({ xpm: getNumValue() }),
      () => ({ damage: getKValue() }),
      () => ({ heal: getKValue() }),
      () => ({ towerDamage: getKValue() }),
    ];

    if (resolvers[tdIndex]) {
      player = {
        ...player,
        ...resolvers[tdIndex](),
      };
    }
  });
  return player;
};

const processMatchParse = async (id, db) => {
  const matchData = {
    id,
    players: [],
  };
  const html = await parse(`/matches/${id}`);
  // const html = await readFile('./commands/dotabuff/mock.html', 'utf8');
  const $ = cheerio.load(html);

  const isTrueSight = !!$('.truesight-intro').html();

  [
    matchData.skillBracket,
    matchData.lobbyType,
    matchData.gameMode,
    matchData.region,
    matchData.duration,
    matchData.endedAt,
  ] = $('.header-content')
    .find('.header-content-secondary > dl > dd')
    .toArray()
    .map((elem, i) => {
      if (i < 5)
        return $(elem)
          .html()
          .trim();
      const date = $(elem)
        .find('time')
        .attr('datetime');
      return date.trim();
    });

  matchData.winner = $('.radiant.match-result.team').text()
    ? 'radiant'
    : 'dire';

  matchData.radiantScore = +$('.the-radiant.score').text();
  matchData.direScore = +$('.the-dire.score').text();

  matchData.players.push(
    ...$('.col-hints.faction-radiant')
      .toArray()
      .slice(0, 5)
      .map(elem => ({
        ...parsePlayer($, elem, isTrueSight),
        side: 'radiant',
      }))
      .filter(x => x),
  );
  matchData.players.push(
    ...$('.col-hints.faction-dire')
      .toArray()
      .slice(0, 5)
      .map(elem => ({
        ...parsePlayer($, elem, isTrueSight),
        side: 'dire',
      }))
      .filter(x => x),
  );
  await db
    .collection('dotabuffMatches')
    .doc(`${id}`)
    .set(matchData);

  console.info('Match parsed successfully');

  const totalKills = matchData.players.reduce(
    (acc, player) => acc + player.kills,
    0,
  );
  const killsRef = await db.collection('dotabuffStats').doc('kills');
  const killRefData = await killsRef.get();
  if (killRefData.exists) {
    const data = killRefData.data();
    if (!data.matches.some(matchId => matchId === id))
      await killsRef.set({
        matches: [id, ...data.matches],
        kills: data.kills + totalKills,
      });
  } else {
    await killsRef.set({ matches: [id], kills: totalKills });
  }
};

exports.default = processMatchParse;
