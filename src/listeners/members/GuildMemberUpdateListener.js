/* eslint-disable */
const { MessageEmbed } = require('discord.js');
const FlameListener = require('../../structures/FlameListener');
const PremiumManager = require('../../managers/PremiumManager');

class GuildMemberUpdateListener extends FlameListener {
  constructor() {
    super('GuildMemberUpdateListener', { event: 'guildMemberUpdate' });
  }

  async run(client, oldMember, newMember) {
    const manager = new PremiumManager(client);

    if (client.config?.premiumRoles.some((role) => newMember.roles.cache.has(role))) {
      if (await manager.find({ userID: newMember.user.id })) return;

      // Выдаем пользователю подписку за материальную поддержку.
      const subscription = {
        userID: newMember.user.id,
        subscriptionDate: Date.now(),
        ends: null,
        premiumGuilds: [],
        premiumGuildsMaxLength: newMember.roles.cache.has('840967269155733525') ? 5 : 2,
      };

      /**
       * 785451649429930025 — Donator
       * 840901839239249951 — Subscriber
       */
      newMember.roles.add(['785451649429930025', '840901839239249951']);
      newMember.send(
        new MessageEmbed()
          .setTitle('Вам была выдана подписка!')
          .setColor('ffa500')
          .setThumbnail(client.user.avatarURL({ size: 2048 }))
          .setDescription(`На ваш аккаунт были зачислены бонусные возможности.\nВоспользуйтесь командой \`bonus activate\` на нужном сервере для их активации (всего слотов: **${subscription.premiumGuildsMaxLength}**)`)
          .setFooter('Спасибо за поддержку! ^-^')
          .setTimestamp(),
      )
      return manager.create(subscription);

    } else if (client.config?.premiumRoles.some((role) => oldMember.roles.cache.has(role) && !newMember.roles.cache.has(role))) {
      const data = await manager.find({ userID: newMember.user.id });
      if (!data) return;

      await newMember.roles.remove('840901839239249951');
      newMember.send(
        new MessageEmbed()
          .setTitle('Ваша подписка закончилась.')
          .setThumbnail(client.user.avatarURL({ size: 2048 }))
          .setColor('ff3333')
          .setDescription(`Подписка, приобретенная вами **${new Date(data.subscriptionDate).toLocaleString('ru')}** закончилась. Все сервера, на которых вы активировали бонусы **потеряли их**.`)
          .setFooter('Для повторной активации бонусов вы должны будете заново оформить подписку.'),
      )
      return manager.cancelPremiumStatus(data);
    }
  }
}

module.exports = GuildMemberUpdateListener;
