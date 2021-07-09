/* eslint-disable */

const { Message, MessageEmbed, APIMessage } = require('discord.js');

class FlameMessage extends Message {
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
    if (this.guild?.cache?.settings?.embedErrorMessages) {
      this.reply(
        new MessageEmbed()
          .setTitle(`${this.client.constants.emojis.FAIL} Ошибка при выполнении команды`)
          .setDescription(args)
          .setColor('ff3333')
          .setFooter(`Вызвано ${this.author.tag}`, this.author.avatarURL({ dynamic: true }))
          .setTimestamp(),
      );
    } else this.reply(this.client.constants.emojis.FAIL + ` ${args}`);
  }
}

module.exports = FlameMessage;