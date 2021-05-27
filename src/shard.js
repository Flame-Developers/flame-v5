const { ShardingManager } = require('discord.js');
const { join } = require('path');
const config = require('../config.json');
const Logger = require('./utils/misc/Logger');

const FlameApiWorker = require('../api/structures/FlameApiWorker');

console.clear();
console.log(` _____ _
|  ___| | __ _ _ __ ___   ___
| |_  | |/ _\` | '_ \` _ \\ / _ \\
|  _| | | (_| | | | | | |  __/
|_|   |_|\\__,_|_| |_| |_|\\___|
              v${require('../package.json').version}
`);
Logger.info(`Starting application (${process.pid}) on ${process.platform} with Node.js ${process.version} installed...`)

const Manager = new ShardingManager(join(__dirname, 'index.js'), {
  token: config.token,
  totalShards: parseInt(config.shards) || 'auto',
  respawn: true,
});

const api = new FlameApiWorker(Manager);

Manager.spawn(Manager.totalShards, 5500, 400000);
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('Exiting... bye bye!');
  return process.exit(0);
});

Manager.on('shardCreate', (shard) => Logger.info(`Spawning shard #${shard.id}...`));
api.start();
