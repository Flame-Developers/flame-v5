const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class InfoCommand extends FlameCommand {
  constructor() {
    super('info', {
      description: 'Краткое описание бота и ссылки на полезные ресурсы.',
      category: 'general',
      usage: 'invite',
      aliases: ['about', 'invite'],
    });
  }

  run(message, args) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(`${message.client.user.username} v${require('../../../package.json').version}`, message.client.user.avatarURL())
        .setColor('ffa500')
        .setDescription('**Flame** — это многофункциональный бот на платформе Discord, созданный с целью объединить функционал многих ботов в одного. Бот имеет множество полезных возможностей, которые подойдут практически для любого сервера: начиная от модерации, заканчивая интересной экономикой. Помимо этого проект активно обновляется, и с каждой неделей бот наполняется новыми функциями.')
        .addField(
          'Основные ресурсы',
          `1. **[Пригласить бота](https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot%20applications.commands)**\n2. [Сервер поддержки](https://discord.gg/7FUJPRCsw8)\n3. [Документация](https://docs.flamebot.ru)`,
          true,
        )
        .addField(
          'Прочее',
          `1. [Бот на SD.C](https://bots.server-discord.com/${message.client.user.id})\n2. [Бот на BotiCord](https://boticord.top/bot/${message.client.user.id})\n3. [Материальная поддержка](https://qiwi.com/n/KRUTOSVIP)`,
          true,
        )
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
  }
}

module.exports = InfoCommand;
