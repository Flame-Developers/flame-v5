const { Structures, Intents } = require('discord.js');
const moment = require('moment');
const FlameClient = require('./structures/FlameClient');

moment.locale('ru');

Structures.extend('Message', () => require('./structures/discord.js/FlameMessage'));

const client = new FlameClient({
  ws: {
    intents: Intents.ALL,
  },
  disableMentions: 'everyone',
});

client._launch().catch(console.error);
