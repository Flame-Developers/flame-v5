const FlameListener = require('../../structures/FlameListener');
const NotificationSenderService = require('../../services/NotificationSenderService');
const PremiumManager = require('../../managers/PremiumManager');

class GuildMemberAddListener extends FlameListener {
  constructor() {
    super('GuildMemberRemoveListener', { event: 'guildMemberRemove' });
  }

  // eslint-disable-next-line consistent-return,class-methods-use-this
  async run(client, member) {
    const manager = new PremiumManager(client);
    const data = await client.database.collection('guilds').findOne({ guildID: member.guild.id });
    const subscription = await manager.find({ userID: member.user.id });

    if (subscription && member.guild.id === client.config.supportServer) {
      await manager.cancelPremiumStatus(subscription);
    }
    if (data) {
      return NotificationSenderService.handleMemberLeave(member, data);
    }
  }
}

module.exports = GuildMemberAddListener;
