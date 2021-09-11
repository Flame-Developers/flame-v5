/* eslint-disable max-len */
const { MessageEmbed } = require('discord.js');
const { PaginatorUtil, PaginatorEntry } = require('../../utils/misc/PaginatorUtil');
const FlameCommand = require('../../structures/FlameCommand');

class HelpCommand extends FlameCommand {
  constructor() {
    super('help', {
      description: 'Список команд и меню помощи.',
      category: 'general',
      usage: 'help [Команда]',
      cooldown: 3,
      aliases: [],
    });
  }

  async run(message, args) {
    const categories = [
      {
        name: 'Основное',
        key: 'general',
      },
      {
        name: 'Модерация',
        key: 'moderation',
      },
      {
        name: 'Настройки',
        key: 'settings',
      },
      {
        name: 'Экономика',
        key: 'economy',
      },
      {
        name: 'Развлекательные',
        key: 'fun',
      },
    ];
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const entries = [];

    for (const category of categories) {
      const embed = new MessageEmbed()
        .setTitle(`Набор команд модуля **${category.name}**:`)
        .setDescription('Если вам нужна более подробная информация об определенной команде, то укажите `help` либо `?` в качестве первого аргумента.\n\n')
        .setColor('ffa500')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
        .setTimestamp();

      message.client.commands.filter((cmd) => cmd.category === category?.key).map((command) => {
        if (data.settings?.hideDisabledCommands && data.disabledCommands?.includes(command.name)) return;
        embed.description += `\`${data.prefix}${command.name}\` — ${command.description}\n`;
      });
      entries.push(
        new PaginatorEntry(null, embed),
      );
    }
    const embed = new MessageEmbed()
      .setTitle('Меню помощи')
      .setDescription(`Для того, чтобы перемещаться по страницам, воспользуйтесь кнопками ниже. Если почему-то на вашем устройстве они не отображаются, обновите/переустановите приложение Discord.\n\nВсего доступно категорий: **${categories.length + 1}**.\nОбщее количество команд: **${message.client.commands.size + message.client.interactions.size}** (**${message.client.interactions.size}** из которых слеш-команды).`)
      .setColor('ffa500')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
      .setTimestamp();

    return new PaginatorUtil(message.client, message.author, [new PaginatorEntry('❓ По всем вопросам обращайтесь на сервер поддержки: https://discord.gg/7FUJPRCsw8\n⭐ Оценивайте нас на GitHub! <https://github.com/Flame-Developers/Flame>', embed), ...entries]).init(message.channel, 350);
  }
}

module.exports = HelpCommand;
