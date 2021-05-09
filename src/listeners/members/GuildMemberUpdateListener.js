/* eslint-disable */
const { MessageEmbed } = require('discord.js');
const FlameListener = require('../../structures/FlameListener');
const PremiumManager = require('../../managers/PremiumManager');
const PremiumNotificationDeliverService = require('../../services/PremiumNotificationDeliverService');

class GuildMemberUpdateListener extends FlameListener {
  constructor() {
    super('GuildMemberUpdateListener', { event: 'guildMemberUpdate' });
  }

  // eslint-disable-next-line consistent-return
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
        premiumGuildsMaxLength: 2,
      };

      newMember.roles.add(['785451649429930025', '840901839239249951']);
      PremiumNotificationDeliverService.premiumBeginNotification(client, subscription);
      // eslint-disable-next-line consistent-return
      return manager.create(subscription);

    } else if (client.config?.premiumRoles.some((role) => oldMember.roles.cache.has(role) && !newMember.roles.cache.has(role))) {
      const data = await manager.find({ userID: newMember.user.id });
      if (!data) return;

      await newMember.roles.remove('840901839239249951');
      PremiumNotificationDeliverService.premiumEndNotification(client, data);
      return manager.delete(data);
    }
  }
}

module.exports = GuildMemberUpdateListener;
