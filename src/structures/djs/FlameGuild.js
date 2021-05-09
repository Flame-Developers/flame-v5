/* eslint-disable */

const { Guild } = require('discord.js');

class FlameGuild extends Guild {
  constructor(client, data) {
    super(client, data);
  }

  async hasPremium() {
    const data = await this.client.database.collection('guilds').findOne({ guildID: this.id });
    return !!data.premium;
  }
}

module.exports = FlameGuild;
