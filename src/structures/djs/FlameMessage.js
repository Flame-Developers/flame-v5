/* eslint-disable */

const { Message, APIMessage } = require('discord.js');

class ExtendedMessage extends Message {
  reply(...args) {
    const apiMessage = APIMessage.create(this.channel, ...args).resolveData();
    apiMessage.data.message_reference = {
      message_id: this.id,
      guild_id: this.guild?.id
    };
    apiMessage.data.allowed_mentions = {
      ...(apiMessage.data.allowed_mentions || {}),
      replied_user: apiMessage.options.ping ?? false
    };

    return this.channel.send(apiMessage);
  }
  fail(...args) {
    return this.reply(this.client.constants.emojis.FAIL + ` ${args}`);
  }
}

module.exports = ExtendedMessage;
