const fetch = require('node-fetch');
const Logger = require('../utils/misc/Logger');

class StatisticsSenderService {
  constructor(client) {
    this.client = client ?? null;
  }

  async init(delay = 1000 * 60 * 15) {
    const URL = `https://api.server-discord.com/v2/bots/${this.client.user?.id}/stats`;
    const API_KEY = this.client.config?.['api-keys']?.sdc;

    const servers = await this.client.shard?.fetchClientValues('guilds.cache.size');
    const shards = this.client?.shard?.count ?? 1;

    return setInterval(() => {
      fetch(URL, {
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
    }, delay);
  }
}

module.exports = StatisticsSenderService;
