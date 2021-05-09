const { MessageEmbed } = require('discord.js');

class PremiumNotificationDeliverService {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static premiumBeginNotification(client, data = {}) {
    const user = client.users.cache.get(data?.userID) ?? null;
    if (user) {
      return user.send(
        new MessageEmbed()
          .setTitle('Вам была выдана подписка!')
          .setColor('ffa500')
          .setThumbnail(client.user.avatarURL({ size: 2048 }))
          .setDescription('На ваш аккаунт были зачислены бонусные возможности.\nВоспользуйтесь командой `bonus` на нужном сервере для их активации.')
          .setFooter('Спасибо за поддержку! ^-^')
          .setTimestamp(),
      );
    }
  }

  static premiumEndNotification(client, data = {}) {
    const user = client.users.cache.get(data?.userID) ?? null;
    if (user) {
      return user.send(
        new MessageEmbed()
          .setTitle('Ваша подписка закончилась.')
          .setThumbnail(client.user.avatarURL({ size: 2048 }))
          .setColor('ff3333')
          .setDescription(`Подписка, приобретенная вами **${new Date(data?.subscriptionDate).toISOString().replace('T', ' ').substr(0, 19)}** закончилась. Все сервера, на которых вы активировали бонусы **потеряли их**.`)
          .setFooter('Для повторной активации бонусов вы должны будете заново оформить подписку.'),
      );
    }
  }
}

module.exports = PremiumNotificationDeliverService;
