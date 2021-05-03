const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class WarnsCommand extends FlameCommand {
  constructor() {
    super('warns', {
      description: 'Посмотреть предупреждения пользователя.',
      category: 'general',
      usage: 'warns [Пользователь]',
      aliases: [],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const warns = data?.warnings.filter((r) => r.user === user.id);

    const embed = new MessageEmbed()
      .setTitle(`Предупреждения пользователя ${user.user.tag}`)
      .setColor('ffa500')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

    if (!warns.length) embed.setDescription('У данного пользователя отсутствуют предупреждения :smile:');
    else {
      embed.setThumbnail(message.guild.iconURL());
      for (const warn of warns.slice(-10)) {
        embed.addField(`\`Предупреждение #${warn.id}\`: ${new Date(warn.time).toISOString().replace('T', ' ').substr(0, 19)} (${warn.moderator})`, `**Причина:** ${warn.reason.slice(0, 999) || 'Причина не указана.'}`);
      }
    }

    return message.reply(embed);
  }
}

module.exports = WarnsCommand;
