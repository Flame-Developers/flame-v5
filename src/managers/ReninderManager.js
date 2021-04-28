class MuteManager {
  constructor(client) {
    this.client = client;
  }

  get reminders() {
    return this.client.database.collection('reminders').countDocuments();
  }

  find(filter) {
    return this.client.database.collection('reminders').findOne(filter);
  }

  delete(filter) {
    return this.client.database.collection('reminders').deleteOne(filter);
  }

  create(schema) {
    return this.client.database.collection('reminders').insertOne(schema);
  }

  handle(data) {
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

module.exports = MuteManager;
