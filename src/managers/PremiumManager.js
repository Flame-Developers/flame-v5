const { MessageEmbed } = require('discord.js');
const Timer = require('../utils/misc/Timer');

class PremiumManager {
  constructor(client) {
    this.client = client;
  }

  get subscriptions() {
    return this.client.database.collection('subscriptions').countDocuments();
  }

  find(filter) {
    return this.client.database.collection('subscriptions').findOne(filter);
  }

  delete(filter) {
    return this.client.database.collection('subscriptions').deleteOne(filter);
  }

  create(schema) {
    return this.client.database.collection('subscriptions').insertOne(schema);
  }

  async cancelPremiumStatus(data) {
    if (!data || !await this.find(data)) return null;
    // eslint-disable-next-line no-restricted-syntax
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
