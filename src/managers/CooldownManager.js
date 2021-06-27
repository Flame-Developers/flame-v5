const BaseManager = require('../structures/BaseManager');

class CooldownManager extends BaseManager {
  constructor(client) {
    super('cooldowns', client);
  }

  async handle(checkInterval = 5000) {
    return setInterval(async () => {
      const cooldowns = await this.client.database.collection(this.colllection).find().toArray();

      for (const cooldown of cooldowns) {
        if (cooldown.ends <= Date.now()) {
          this.delete(cooldown);
        }
      }
    }, checkInterval);
  }
}

module.exports = CooldownManager;
