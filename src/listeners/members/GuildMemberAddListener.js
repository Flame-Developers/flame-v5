const FlameListener = require('../../structures/FlameListener');
const NotificationSenderService = require('../../services/NotificationSenderService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');

class GuildMemberAddListener extends FlameListener {
  constructor() {
    super('GuildMemberAddListener', { event: 'guildMemberAdd' });
  }

  // eslint-disable-next-line consistent-return,class-methods-use-this
  async run(client, member) {
    const data = await client.database.collection('guilds').findOne({ guildID: member.guild.id });
    if (await member.guild.hasPremium()) {
      DatabaseHelper.createGuildMemberEntry(client, {
        options: { upsert: true },
        guild: member.guild.id,
        user: member.user.id,
        // eslint-disable-next-line global-require
        schema: require('../../utils/Schemas').UserSchema,
      });
    }
    if (data) {
      return NotificationSenderService.handleNewJoin(member, data);
    }
  }
}

module.exports = GuildMemberAddListener;
