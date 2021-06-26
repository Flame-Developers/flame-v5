const BaseManager = require('../structures/BaseManager');
const Timer = require('../utils/misc/Timer');

class PremiumManager extends BaseManager {
  constructor(client) {
    super('subscriptions', client);
  }

  async cancelPremiumStatus(data) {
    if (!data || !await this.find(data)) return null;
    for (const id of data?.premiumGuilds) {
      this.client.database.collection('guilds').updateOne({ guildID: id }, {
        $set: {
          premium: false,
        },
      });
    }
    return this.delete(data);
  }
}

module.exports = PremiumManager;
