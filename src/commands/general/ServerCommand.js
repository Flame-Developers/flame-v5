const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { regions, verifyLevels } = require('../../utils/Constants');

class ServerCommand extends FlameCommand {
  constructor() {
    super('server', {
      description: 'Показывает информацию о сервере.',
      category: 'general',
      usage: 'server',
      aliases: ['serverinfo', 'server-info'],
    });
  }

  run(message, args) {
    const embed = new MessageEmbed()
      .setAuthor(`Информация о ${message.guild.name} (${message.guild.id})`, message.guild.iconURL())
      .setColor('ffa500')
      .addField(`Участников [${message.guild.memberCount}]:`, `<:online2:814075431758069790> В сети: **${
        message.guild.members.cache.filter(
          (m) => m.user.presence.status === 'online',
        ).size
      }**\n<:dnd2:814075464078983229> Не беспокоить: **${
        message.guild.members.cache.filter(
          (m) => m.user.presence.status === 'dnd',
        ).size
      }**\n<:idle:814075524829282374> Не на месте: **${
        message.guild.members.cache.filter(
          (m) => m.user.presence.status === 'idle',
        ).size
      }**\n<:offline2:814075554856304660> Не в сети: **${
        message.guild.members.cache.filter(
          (m) => m.user.presence.status === 'offline',
        ).size
      }**`,
      true)
      .addField(`Каналы [${message.guild.channels.cache.size}]:`, `<:textchannel:814927097453608972> Текстовых: **${message.guild.channels.cache.filter((x) => x.type === 'text').size}**\n<:voicechannel:814927126498246658> Голосовых: **${message.guild.channels.cache.filter((x) => x.type === 'voice').size}**`, true)
      .addField('Регион', regions[message.guild.region], true)
      .addField('Владелец', `${message.guild.owner.user.tag} (${message.guild.owner.id})`, true)
      .addField('Уровень проверки', verifyLevels[message.guild.verificationLevel], true)
      .addField('Дата создания', new Date(message.guild.createdAt).toISOString().replace('T', ' ').substr(0, 19), true)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

    if (message.client?.shard) embed.setDescription(`Данный сервер расположен на шарде **#${message.guild?.shardID}**.`);
    return message.reply(embed).catch();
  }
}

module.exports = ServerCommand;
