const FlameListener = require('../../structures/FlameListener');
const NotificationSenderService = require('../../services/NotificationSenderService');

class GuildMemberAddListener extends FlameListener {
  constructor() {
    super('GuildMemberAddListener', { event: 'guildMemberAdd' });
  }

  // eslint-disable-next-line consistent-return,class-methods-use-this
  async run(client, member) {
    const data = await client.database.collection('guilds').findOne({ guildID: member.guild.id });
    if (data) {
      return NotificationSenderService.handleNewJoin(member, data);
    }
  }
}

module.exports = GuildMemberAddListener;
