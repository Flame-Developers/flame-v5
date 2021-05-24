const { GuildMember } = require('discord.js');

class InteractionData {
  constructor(client, data) {
    this.client = client;

    this.version = data.version ?? 0;
    this.type = data.type ?? 2;
    this.token = data.token ?? null;
    this.data = data.data ?? {};
    this.id = data.id ?? 0;

    this.guild = this.client.guilds.cache.get(data.guild_id);
    this.channel = this.client.channels.cache.get(data.channel_id);
    this.member = new GuildMember(this.client, data.member, this.guild);

    this.options = {};

    if (data?.data?.options) {
      data.data.options.forEach((option) => {
        this.options[option.name] = option.value;
      });
    }
  }
}

module.exports = InteractionData;
