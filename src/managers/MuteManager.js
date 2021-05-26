class MuteManager {
  constructor(client) {
    this.client = client;
  }

  get mutes() {
    return this.client.database.collection('mutes').countDocuments();
  }

  find(filter) {
    return this.client.database.collection('mutes').findOne(filter);
  }

  delete(filter) {
    return this.client.database.collection('mutes').deleteOne(filter);
  }

  create(schema) {
    return this.client.database.collection('mutes').insertOne(schema);
  }

  async handle(data) {
    if (!await this.find(data)) await this.create(data);

    return setTimeout(async () => {
      if (data.ends > Date.now()) return this.handle(data);
      const guild = this.client.guilds.cache.get(data.guildID);
      const mute = await this.find(data);

      if (guild && mute) {
        this.delete(data);
        return guild.members.cache
          .get(data.userID)
          ?.roles?.remove(data.muteRole)
          .catch(null);
      }
    }, data.ends - Date.now());
  }
}

module.exports = MuteManager;
