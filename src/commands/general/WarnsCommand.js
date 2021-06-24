const { MessageEmbed } = require('discord.js');
const { PaginatorUtil, PaginatorEntry } = require('../../utils/misc/PaginatorUtil');
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
    // eslint-disable-next-line max-len
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const warns = data?.warnings.filter((r) => r.user === user.id);

    if (!warns.length) return message.fail('У данного пользователя отсутствуют предупреждения на данном сервере.');

    const entries = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Math.ceil(warns.length / 10); i++) {
      const embed = new MessageEmbed()
        .setTitle(`Предупреждения пользователя ${user.user.tag}`)
        .setDescription(`Общее количество предупреждений: **${warns.length ?? '-'}**.`)
        .setColor('ffa500')
        .setThumbnail(message.guild.iconURL())
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      let count = 0;
      warns.slice(i * 10, i * 10 + 10)
        // eslint-disable-next-line array-callback-return
        .map((warn) => {
          count++;
          embed.addField(`${count}. \`#${warn.id}\` [${new Date(warn.time).toLocaleString('ru')}] (${warn.moderator}):`, `Причина: **${warn.reason ?? 'Причина предупреждения отсутствует.'}**`);
        });
      entries.push(new PaginatorEntry(null, embed));
    }
    return new PaginatorUtil(message.client, message.author, entries).init(message.channel, 150);
  }
}

module.exports = WarnsCommand;
