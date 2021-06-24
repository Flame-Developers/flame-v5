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

  async handle(data) {
    if (!await this.find(data)) await this.create(data);
    // eslint-disable-next-line consistent-return
    return new Timer(data.ends, async () => {
      const user = this.client.users.cache.get(data.userID);
      const subscription = await this.find(data);

      if (user && subscription) {
        return this.delete(data);
      }
    });
  }
}

module.exports = PremiumManager;
