const fetch = require('node-fetch');

class StatisticsSenderService {
  constructor(client) {
    this.client = client ?? null;
  }

  async init(delay) {
    const URL = `https://api.server-discord.com/v2/bots/${this.client.user?.id}/stats`;
    const API_KEY = this.client.config?.['api-keys']?.sdc;

    const servers = await this.client.shard?.fetchClientValues('guilds.cache.size');
    const shards = this.client?.shard?.count ?? 1;

    return setInterval(async () => {
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
    }, delay ?? 1000 * 60 * 15);
  }
}

module.exports = StatisticsSenderService;
