const Discord = require('discord.js');
const fetch = require('node-fetch');
const FlameCommand = require('../../structures/FlameCommand');
const { formatNumber } = require('../../utils/Functions');
const { dependencies } = require('../../../package.json');

class StatsCommand extends FlameCommand {
  constructor() {
    super('stats', {
      description: 'Показывает статистику бота.',
      category: 'general',
      cooldown: 5,
      usage: 'stats',
      aliases: [],
    });
  }

  async run(message, args) {
    message.channel.startTyping();
    fetch('https://api.flamebot.ru/public/stats')
      .then((res) => res.json())
      .then((res) => {
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.client.user.tag, message.client.user.avatarURL({ size: 2048 }))
          .setDescription(`Данный сервер расположен на шарде **${message.guild.shardID}**. Источник статистики: [api.flamebot.ru](https://api.flamebot.ru/public/stats). Информация обновляется каждые 5 минут.`)
          .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
          .addField(
            'Статистика бота',
            `**Серверов:** ${formatNumber(res.totalGuilds) ?? '-'}\n`
                + `**Пользователей:** ${formatNumber(res.totalUsers) ?? '-'}\n`
                + `**Осколков:** ${res.totalShards ?? '-'}`,
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
          .setFooter('Последний перезапуск бота')
          .setTimestamp(new Date(message.client.readyAt).getTime());

        let pings = '';
        for (const shard of res?.shards) {
          pings += `• ${shard.disconnected ? '🔴' : '🟢'} Осколок #${shard.id} -> ${shard.ping ?? '-'}ms\n`;
        }

        embed.addField('Состояния осколков (WebSocket)', `\`\`\`diff\n${pings}\`\`\``);
        message.channel.send(embed);
      });
    await message.channel.stopTyping();
  }
}

module.exports = StatsCommand;
