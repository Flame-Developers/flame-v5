/* eslint-disable */
const StringParserUtil = require('../utils/misc/StringParserUtil');
const buildAntiInviteMessage = require('../helpers/messages/buildAntiInviteMessage');

class AntiInviteService {
  constructor(client, message) {
    this.client = client;
    this.message = message;
  }

  async applyActions() {
    const data = await this.client.database.collection('guilds').findOne({ guildID: this.message?.guild.id });
    if (data.antiInvite?.enabled && this.message.guild.me.permissions.has('ADMINISTRATOR')) {
      //if (this.message.member.permissions.has('ADMINISTRATOR')) return false;

      this.message.delete().catch(() => {});
      if (data.antiInvite?.message) this.message.channel.send(
        buildAntiInviteMessage(this.message.member, data.antiInvite.message),
      );
    }
  }
}

module.exports = AntiInviteService;
