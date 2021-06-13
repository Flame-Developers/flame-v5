const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class AvatarCommand extends FlameCommand {
  constructor() {
    super('avatar', {
      description: 'Отображает аватарку указанного вами пользователя.',
      category: 'general',
      usage: 'avatar [@Пользователь/ID]',
      aliases: [],
      examples: [
        'f.avatar 553557567591284737',
        'f.avatar @lapfed255#4189',
      ],
    });
  }

  run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    return message.reply(
      new MessageEmbed()
        .setDescription(`Аватарка пользователя **${user.user.tag}:**`)
        .setColor('ffa500')
        .setImage(user.user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
  }
}

module.exports = AvatarCommand;
