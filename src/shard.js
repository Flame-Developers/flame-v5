const { ShardingManager } = require('discord.js');
const { join } = require('path');
const config = require('../config.json');
const Logger = require('./utils/Logger');

const FlameApiWorker = require('../api/structures/FlameApiWorker');

console.clear();
Logger.info(`Starting application (${process.pid}) on ${process.platform} with Node.js ${process.version} installed...`)

const Manager = new ShardingManager(join(__dirname, 'index.js'), {
  token: config.token,
  totalShards: parseInt(config.shards) || 'auto',
  respawn: true,
});

const api = new FlameApiWorker(Manager);

Manager.spawn(Manager.totalShards, 5500, 400000);

Manager.on('shardCreate', (shard) => Logger.info(`Spawning shard #${shard.id}...`));
api.start();
