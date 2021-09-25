const { Message } = require('discord.js');
const StringParserUtil = require('../utils/misc/StringParserUtil');

class InviteDetectorService {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }
  // eslint-disable-next-line
  static async #checkInvite(guild, code) {
    return await new Promise((resolve) => {
      if (guild.inviteCache) {
        for (const invite of guild.inviteCache) {
          if (code === invite[0]) return resolve(true);
        }
        resolve(false);
      } else {
        guild.fetchInvites().then((invites) => {
          guild.inviteCache = invites;
          for (const invite of invites) {
            if (code === invite[0]) return resolve(true);
          }
          resolve(false);
        });
      }
    });
  }

  static async hasInvites(message, string = null) {
    if (!message || !(message instanceof Message)) throw new Error('A valid instance of Discord.Message must be provided.');
    const data = StringParserUtil.parseInvites(string ?? message?.content);

    if (!data) return false;
    else {
      return !await this.#checkInvite(message.guild, data.inviteCode);
    }
  }
}

module.exports = InviteDetectorService;
