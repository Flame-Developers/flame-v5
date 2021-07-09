const { Structures, Intents } = require('discord.js');
const moment = require('moment');
const FlameClient = require('./structures/FlameClient');

moment.locale('ru');

// eslint-disable-next-line global-require
Structures.extend('Message', () => require('./structures/discord.js/FlameMessage'));

const client = new FlameClient({
  ws: {
    intents: Intents.ALL,
  },
  disableMentions: 'everyone',
});

// eslint-disable-next-line no-console,no-underscore-dangle
client._launch().catch(console.error);
