const BaseManager = require('../structures/BaseManager');

class CooldownManager extends BaseManager {
  constructor(client) {
    super('cooldowns', client);
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
