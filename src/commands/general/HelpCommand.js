const { MessageEmbed } = require('discord.js');
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
        description: 'Основные возможности бота для обыкновенных пользователей.',
      },
      {
        name: 'Модерация',
        key: 'moderation',
        description: 'Утилиты для модераторов Discord-сообществ.',
      },
      {
        name: 'Настройки',
        key: 'settings',
        description: 'Конфигурация и настройка бота.',
      },
      {
        name: 'Экономика',
        key: 'economy',
        description: 'Различные команды связанные с экономикой.',
      },
    ];
    const data = await message.client.database
      .collection('guilds')
      .findOne({ guildID: message.guild.id });

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle('Меню помощи')
        .setDescription(
          `Узнать набор команд той или иной категории можно воспользовавшись командой \`${data.prefix}help <Модуль>\`.`,
        )
        .setColor('ffa500')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      for (const category of categories) {
        embed.addField(category.name, category.description, true);
      }

      return message.channel.send(embed);
    } if (args[0]) {
      const category = categories.find((c) => c.name === args[0] || c.key === args[0]);
      if (!category) return message.fail('Указанная вами категория не была найдена в списке доступных.');

      const embed = new MessageEmbed()
        .setTitle(`Набор команд модуля **${category.name}**:`)
        .setDescription(
          'Если вам нужна более подробная информация об определенной команде, то посетите [наш сайт](https://flamebot.ru/commands).\n\n',
        )
        .setColor('ffa500')
        .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      // eslint-disable-next-line array-callback-return
      message.client.commands.filter((cmd) => cmd.category === category.key).map((command) => {
        // eslint-disable-next-line max-len
        if (data.settings.hideDisabledCommands && data.disabledCommands.includes(command.name)) return;
        embed.description += `\`${data.prefix}${command.name}\` — ${command.description}\n`;
      });

      return message.channel.send(embed);
    }
  }
}

module.exports = HelpCommand;
