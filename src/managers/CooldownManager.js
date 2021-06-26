const BaseManager = require('../structures/BaseManager');

class CooldownManager extends BaseManager {
  constructor(client) {
    super('cooldowns', client);
  }

  async handle(checkInterval = 5000) {
    return setInterval(async () => {
      const cooldowns = await this.client.database.collection(this.colllection).find().toArray();

      // eslint-disable-next-line consistent-return
      cooldowns.forEach((cooldown) => {
        if (Date.now() >= cooldown.ends) return this.delete(cooldown);
      });
    }, checkInterval);
  }
}

module.exports = CooldownManager;
