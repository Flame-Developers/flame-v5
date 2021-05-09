const { MessageEmbed } = require('discord.js');
const Timer = require('../utils/Timer');

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

  handle(data) {
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
