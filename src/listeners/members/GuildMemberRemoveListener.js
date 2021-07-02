const FlameListener = require('../../structures/FlameListener');
const PremiumManager = require('../../managers/PremiumManager');
const buildLeaveMessage = require('../../helpers/messages/buildLeaveMessage');

class GuildMemberAddListener extends FlameListener {
  constructor() {
    super('GuildMemberRemoveListener', { event: 'guildMemberRemove' });
  }

  async run(client, member) {
    const data = await client.database.collection('guilds').findOne({ guildID: member.guild.id });
    const subscription = await client.database.collection('subscriptions').findOne({ userID: member.user.id });

    if (subscription && member.guild.id === client.config.supportServer) {
      await new PremiumManager(client).cancelPremiumStatus(subscription);
    }
    if (data) {
      if (data.leave?.enabled && data.leave?.channel && data.leave?.text) {
        member.guild.channels.cache.get(data.leave.channel)
          .send(buildLeaveMessage(member, data.leave.text))
          .catch(() => null);
      }
    }
  }
}

module.exports = GuildMemberAddListener;
