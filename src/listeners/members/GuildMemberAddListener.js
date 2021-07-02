const FlameListener = require('../../structures/FlameListener');
const buildWelcomeMessage = require('../../helpers/messages/buildWelcomeMessage');

class GuildMemberAddListener extends FlameListener {
  constructor() {
    super('GuildMemberAddListener', { event: 'guildMemberAdd' });
  }

  async run(client, member) {
    const data = await client.database.collection('guilds').findOne({ guildID: member.guild.id });
    if (data) {
      if (data.welcome?.enabled && data.welcome?.channel && data.welcome?.text) {
        member.guild.channels.cache.get(data.welcome.channel)
          .send(buildWelcomeMessage(member, data.welcome.text))
          .catch(() => null);
      }
      if (data.welcome?.role) member.roles.add(data.welcomeRole);
    }
  }
}

module.exports = GuildMemberAddListener;
