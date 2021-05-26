class CooldownManager {
  constructor(client) {
    this.client = client;
  }

  get cooldowns() {
    return this.client.database.collection('cooldowns').countDocuments();
  }

  find(filter) {
    return this.client.database.collection('cooldowns').findOne(filter);
  }

  delete(filter) {
    return this.client.database.collection('cooldowns').deleteOne(filter);
  }

  create(schema) {
    return this.client.database.collection('cooldowns').insertOne(schema);
  }

  async handle(data) {
    if (!await this.find(data)) await this.create(data);

    return setTimeout(async () => {
      if (data.ends > Date.now()) return this.handle(data);
      const cooldown = await this.find(data);

      if (cooldown) {
        return this.delete(data);
      }
    }, data.ends - Date.now());
  }
}

module.exports = CooldownManager;
