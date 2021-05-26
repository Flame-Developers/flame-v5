class DatabaseHelper {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static createGuildEntry(client, { guild, schema, options = {} }) {
    if (!client || !client?.database) throw new TypeError('A valid client instance must be specified.');
    client.database.collection('guilds').updateOne({ guildID: guild }, {
      $set: schema,
    }, options);
  }

  static createGuildMemberEntry(client, { guild, user, schema, options = {} }) {
    if (!client || !client?.database) throw new TypeError('A valid client instance must be specified.');
    client.database.collection('guildusers').updateOne({ guildID: guild, userID: user }, {
      $set: schema,
    }, options);
  }
}

module.exports = DatabaseHelper;
