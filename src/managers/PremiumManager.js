const BaseManager = require('../structures/BaseManager');

class PremiumManager extends BaseManager {
  constructor(client) {
    super('subscriptions', client);
    this.client = client;
  }

  async cancelPremiumStatus(data) {
    if (!data || !await this.find(data)) return null;

    for (const id of data?.premiumGuilds) {
      this.client.database.collection('guilds').updateOne({ guildID: id }, {
        $set: {
          premium: false,
        },
      });
      this.client.guilds.cache.get(id).cache?.set('premium', false);
    }
    return this.delete(data);
  }
}

module.exports = PremiumManager;
