const BaseManager = require('../structures/BaseManager');

class MuteManager extends BaseManager {
  constructor(client) {
    super('mutes', client);
  }

  handle(checkInterval = 5000) {
    return setInterval(async () => {
      const mutes = await this.client.database.collection(this.colllection).find().toArray();

      for (const mute of mutes) {
        const guild = this.client.guilds.cache.get(mute.guildID);
        if (guild && mute.ends <= Date.now()) {
          this.delete(mute);
          guild.members.cache.get(mute.userID)?.roles?.remove(mute.muteRole)
            .catch(() => {});
        }
      }
    }, checkInterval);
  }
}

module.exports = MuteManager;
