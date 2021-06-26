const crypto = require('crypto');
const BaseManager = require('../structures/BaseManager');

class ReminderManager extends BaseManager {
  constructor(client) {
    super('reminders', client);
  }

  generateID() {
    return crypto.createHash('md5').update(Math.random().toString(32)).digest('hex');
  }

  async handle(checkInterval = 5000) {
    return setInterval(async () => {
      const reminders = await this.client.database.collection(this.colllection).find().toArray();

      // eslint-disable-next-line consistent-return
      reminders.forEach((reminder) => {
        const user = this.client.users.cache.get(reminder.userID);
        if (user && Date.now() >= reminder.timeout) {
          this.delete(reminder);
          return user?.send(`🔔 **Напоминание**\n${reminder.details.message}`)
            .catch(() => {});
        }
      });
    }, checkInterval);
  }
}

module.exports = ReminderManager;
