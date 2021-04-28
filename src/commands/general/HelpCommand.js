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
        description:
          'Основные возможности бота для обыкновенных пользователей.',
      },
      {
        name: 'Модерация',
        key: 'moderation',
        description:
          'Команды и утилиты для модераторов/администраторов сообществ.',
      },
      {
        name: 'Музыка',
        key: 'music',
        description: 'Команды для прослушивания музыки в голосовых каналах 🎵',
      },
    ];
    const data = await message.client.database
      .collection('guilds')
      .findOne({ guildID: message.guild.id });

    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle('Меню помощи')
        .setDescription(
          `Узнать набор команд той или иной категории можно воспользовавшись командой \`${data.prefix}help <Модуль>\`.`
        )
        .setColor('ffa500')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      for (const category of categories) {
        embed.addField(category.name, category.description);
      }

      return message.channel.send(embed);
    } else if (args[0]) {
      const category = categories.find((c) => c.name == args[0] || c.key == args[0]);
      if (!category)
        return message.reply(
          'Указанная вами категория не была найдена в списке доступных :no_entry:'
        );

      const embed = new MessageEmbed()
        .setTitle(`Набор команд модуля **${category.name}**:`)
        .setDescription(
          'Если вам нужна более подробная информация об определенной команде, то посетите [наш сайт](https://flamebot.ru/commands).'
        )
        .setColor('ffa500')
        .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      message.client.commands.filter(cmd => cmd.category == category.key).map((command) => {
        embed.addField(`${data.prefix + command.name}`, command.description);
      });

      return message.channel.send(embed);
    }
  }
}

module.exports = HelpCommand;
