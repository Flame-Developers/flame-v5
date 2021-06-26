const BaseManager = require('../structures/BaseManager');

class MuteManager extends BaseManager {
  constructor(client) {
    super('mutes', client);
  }

  handle(checkInterval = 5000) {
    return setInterval(async () => {
      const mutes = await this.client.database.collection(this.colllection).find().toArray();

      // eslint-disable-next-line consistent-return
      mutes.forEach((mute) => {
        const guild = this.client.guilds.cache.get(mute.guildID);
        if (guild && Date.now() >= mute.ends) {
          this.delete(mute);
          return guild.members.cache.get(mute.userID)?.roles?.remove(mute.muteRole)
            .catch(() => {});
        }
      });
    }, checkInterval);
  }
}

module.exports = MuteManager;
