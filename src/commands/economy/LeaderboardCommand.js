const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class LeaderboardCommand extends FlameCommand {
  constructor() {
    super('leaderboard', {
      description: 'Список лидеров экономики.',
      category: 'economy',
      usage: 'leaderboard',
      aliases: ['top', 'lb', 'leaders'],
      cooldown: 5,
    });
  }

  async run(message, args) {
    message.channel.startTyping();

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers')
      .aggregate([
        { $match: { guildID: message.guild.id } },
        { $addFields: { total: { $sum: ['$money', '$bank'] } } },
        { $sort: { total: -1 } },
      ]).limit(10).toArray();

    const embed = new MessageEmbed()
      .setTitle('Список лидеров')
      .setDescription('Ниже вы сможете найти самых богатых людей по меркам экономики данного сервера. Попасть в этот список можно путем активного заработка командами как `work`, `crime`, `rob` и т.п.\n\n')
      .setColor('ffa500')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

    let i = 0;
    for (const document of data) {
      embed.description += `**${++i}**. [${message.guild.members.cache.get(document.userID)?.user?.username ?? 'Неизвестный пользователь'}](https://flamebot.ru) • ${document.money + document.bank}${guild.currency}\n`;
    }

    message.channel.send(embed);
    message.channel.stopTyping();
  }
}

module.exports = LeaderboardCommand;
