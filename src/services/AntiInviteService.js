/* eslint-disable */
const StringParserUtil = require('../utils/misc/StringParserUtil');

class AntiInviteService {
  constructor(client, message) {
    this.client = client;
    this.message = message;
  }

  async applyActions() {
    const data = await this.client.database.collection('guilds').findOne({ guildID: this.message?.guild.id });
    if (data.antiInvite?.enabled && this.message.guild.me.permissions.has('ADMINISTRATOR')) {
      if (this.message.member.permissions.has('ADMINISTRATOR')) return false;

      this.message.delete().catch(() => {});
      if (data.antiInvite?.message) this.message.channel.send(
        StringParserUtil.parse(data.antiInvite.message, {
          'user': this.message.author,
          'user.tag': this.message.author.tag,
          'user.id': this.message.author.id,
        }),
      );
    }
  }
}

module.exports = AntiInviteService;
