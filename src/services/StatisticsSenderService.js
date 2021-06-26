const fetch = require('node-fetch');
const Logger = require('../utils/misc/Logger');

class StatisticsSenderService {
  constructor(client) {
    this.client = client ?? null;
  }

  async send() {
    const URL = `https://api.server-discord.com/v2/bots/681096280193368073/stats`;
    const API_KEY = this.client.config?.['api-keys']?.sdc;
    
    const servers = await this.client.shard?.fetchClientValues('guilds.cache.size');
    const shards = this.client?.shard?.count ?? 1;

    await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `SDC ${API_KEY}`,
      },
      body: JSON.stringify(
        {
          servers: servers.reduce((a, g) => a + g, 0),
          shards,
        },
      ),
    });
    Logger.info(`Completed request to ${URL} in order to post statistics.`);
  }
}

module.exports = StatisticsSenderService;
