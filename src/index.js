const { Intents } = require('discord.js');
const FlameClient = require('./structures/FlameClient');
const LoggerService = require('./services/LoggerService');

const client = new FlameClient({
  intents: Intents.ALL,
  allowedMentions: {
    parse: [],
  },
});

client._launch();
client.on('shardDisconnect', (data, id) =>
  LoggerService.sendLog(
    `<@&834032944120856607> Shard \`#${id}\` was disconnected with ${data?.reason?.length <= 0 ? '**no reason**' : `reason **${data.reason}**`} (code **${data.code ?? 'was not provided'}**)`
  )
);
