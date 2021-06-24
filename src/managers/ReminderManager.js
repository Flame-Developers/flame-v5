const crypto = require('crypto');
const BaseManager = require('../structures/BaseManager');

class ReminderManager extends BaseManager {
  constructor(client) {
    super('reminders', client);
  }

  generateID() {
    return crypto.createHash('md5').update(Math.random().toString(32)).digest('hex');
  }

  async handle(data) {
    if (!await this.find(data)) await this.create(data);

    return setTimeout(async () => {
      if (data.timeout > Date.now()) return this.handle(data);
      const user = this.client.users.cache.get(data.userID);
      const reminder = await this.find(data);

      if (reminder && user) {
        this.delete(data);
        return user
          .send(`🔔 **Напоминание**\n${reminder.details.message}`)
          .catch(null);
      }
    }, data.tiemout - Date.now());
  }
}

module.exports = ReminderManager;
