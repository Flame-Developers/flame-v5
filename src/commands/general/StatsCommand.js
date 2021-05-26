const Discord = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { formatNumber } = require('../../utils/Functions');
const { dependencies } = require('../../../package.json');

class StatsCommand extends FlameCommand {
  constructor() {
    super('stats', {
      description: 'Показывает статистику бота.',
      category: 'general',
      cooldown: 3,
      usage: 'stats',
      aliases: [],
    });
  }

  async run(message, args) {
    Promise.all(
      [
        await message.client.shard.fetchClientValues('guilds.cache.size'),
        await message.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        await message.client.shard.fetchClientValues('channels.cache.size'),
      ],
    ).then((res) => {
      return message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(message.client.user.tag, message.client.user.avatarURL({ size: 2048 }))
          .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
          .setDescription(`На текущий момент, бот запущен с **${message.client?.shard?.count ?? 0}** шардами(-ом). Данный сервер расположен на **${message.guild.shardID}** шарде.`)
          .addField(
            'Статистика бота',
            `**Серверов:** ${formatNumber(res[0].reduce((a, b) => a + b, 0))}\n`
                + `**Пользователей:** ${formatNumber(res[1].reduce((a, b) => a + b, 0))}\n`
                + `**Каналов:** ${formatNumber(res[2].reduce((a, b) => a + b, 0))}`,
            true,
          )
          .addField(
            'Зависимости',
            `**Discord.js:** v${Discord.version}\n`
                + `**MongoDB:** v${dependencies.mongodb}\n`
                + `**Node.js:** ${process.version}`,
            true,
          )
          .setColor('ffa500')
          .setFooter('Последний перезапуск')
          .setTimestamp(new Date(message.client.readyAt).getTime()),
      );
    });
  }
}

module.exports = StatsCommand;
