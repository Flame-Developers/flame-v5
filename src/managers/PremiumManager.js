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
        user.send(
          new MessageEmbed()
            .setTitle('Ваша подписка закончилась.')
            .setThumbnail(this.client.user.avatarURL({ size: 2048 }))
            .setColor('ff3333')
            .setDescription(`Подписка, приобретенная вами **${new Date(data.subscriptionDate).toISOString().replace('T', ' ').substr(0, 19)}** закончилась. Все сервера, на которых вы активировали бонусы **потеряли их**.`)
            .setFooter('Для повторной активации бонусов вы должны будете заново оформить подписку.'),
        );
        return this.delete(data);
      }
    });
  }
}

module.exports = PremiumManager;
