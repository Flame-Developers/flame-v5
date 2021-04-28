const fetch = require('node-fetch');
const FlameCommand = require('../../structures/FlameCommand');
const { timeFromNow, formatNumber } = require('../../utils/Functions');

class StatsCommand extends FlameCommand {
  constructor() {
    super('stats', {
      description: 'Возвращает статистику бота.',
      category: 'general',
      cooldown: 3,
      usage: 'stats',
      aliases: [],
    });
  }

  async run(message, args) {
    const { version } = require('../../../package.json');

    Promise.all(
      [
        await message.client.shard.fetchClientValues('guilds.cache.size'),
        await message.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
      ],
    ).then(async (res) => {
      let data = await fetch('http://localhost:3000/');
      data = await data.json();

      return message.channel.send(
        `🔁 Последний перезапуск был примерно **${timeFromNow(Date.now() - message.client.uptime)}**. Текущая версия бота: **${version}**\n\`\`\`\n`
                + `- Задержка:                      ${message.client.ws.ping}ms\n`
                + `- Ответы на команды:             ${Date.now() - message.createdAt}ms\n`
                + `- Шардов:                        ${message.client.shard.count}\n`
                + '\n\n'
                + `- Серверов:                      ${formatNumber(res[0].reduce((a, b) => a + b), 0)}\n`
                + `- Серверов на этом шарде:        ${formatNumber(message.client.guilds.cache.size)}\n`
                + `- Пользователей:                 ${formatNumber(res[1].reduce((a, b) => a + b), 0)}\n`
                + '\n\n'
                + `- Состояние API:                 ${data.statusCode ?? 502}\n`
                + `- Версия Node.js:                ${process.version}\n`
                + `- Версия Discord.js:             v${require('discord.js').version}`
                + '```',
      );
    });
  }
}

module.exports = StatsCommand;
