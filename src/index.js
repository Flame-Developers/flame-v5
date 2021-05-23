const { Structures, Intents } = require('discord.js');
const moment = require('moment');
const FlameClient = require('./structures/FlameClient');
const LoggerService = require('./services/LoggerService');

moment.locale('ru');

// eslint-disable-next-line global-require
Structures.extend('Guild', () => require('./structures/djs/FlameGuild'));
// eslint-disable-next-line global-require
Structures.extend('Message', () => require('./structures/djs/FlameMessage'));

const client = new FlameClient({
  ws: {
    intents: Intents.ALL,
  },
  disableMentions: 'all',
});

// eslint-disable-next-line no-console,no-underscore-dangle
client._launch().catch(console.error);
client.on('shardDisconnect', (data, id) => // eslint-disable-next-line
  LoggerService.sendLog(
    `<@&834032944120856607> Shard \`#${id}\` was disconnected with ${data?.reason?.length <= 0 ? '**no reason**' : `reason **${data.reason}**`} (code **${data.code ?? 'was not provided'}**)`,
  ));
