/*
 MIT License
 Copyright (c) 2021 DeleterBot
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

const cache = {};

async function collectBotStatistics() {
  let cachingRequired = false;
  const arr = [];
  const script = '[this.ws.ping, this.ws.destroyed, this.guilds.cache.size, this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)]';

  if (cache.expires > Date.now()) return { shards: cache.stats.shards, ...cache.stats.stats };
  cachingRequired = true;

  const stats = {
    totalGuilds: 0,
    totalUsers: 0,
    totalShards: 0,
  };
  // eslint-disable-next-line no-undef,no-restricted-syntax
  for await (const shard of Array.from(ApiWorker.manager?.shards.values())) {
    const data = await shard.eval(script);

    stats.totalGuilds += data[2];
    stats.totalUsers += data[3];
    stats.totalShards++;

    arr.push({
      id: shard.id + 1,
      disconnected: data[1],
      ping: data[0] ?? 0,
      guilds: data[2] ?? 0,
      cachedUsers: data[3] ?? 0,
    });
  }

  if (cachingRequired) {
    cache.stats = {
      shards: arr,
      stats,
    };
    cache.expires = Date.now() + 1000 * 60 * 3;
  }

  return {
    statusCode: 200,
    shards: arr,
    ...stats,
  };
}

async function collectNodesStatistics() {
  let data = await ApiWorker.manager.shards
    .first()
    .eval('this.shoukaku.nodes.size');

  if (!data) return { message: 'No nodes are available at this moment.' };

  data = await ApiWorker.manager.shards
    .first()
    .eval('this.shoukaku.getNode()');

  return {
    statusCode: 200,
    name: data.name ?? null,
    connected: data?.state === 'CONNECTED',
    stats: {
      activePlayers: data.stats?.playingPlayers ?? 0,
      launchedAt: new Date(Date.now() - data.stats.uptime).toISOString().replace('T', ' ').substr(0, 19) ?? null,
      memoryUsage: `${(data.stats.memory.used / 1024 ** 2).toFixed()}MB` ?? 0,
    },
  };
}

module.exports = { collectBotStatistics, collectNodesStatistics };
