const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const Constants = require('../../utils/Constants');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class CooldownCommand extends FlameCommand {
  constructor() {
    super('cooldown', {
      description: 'Управление кулдаунами команд экономики.',
      category: 'settings',
      aliases: [],
      usage: 'cooldown [set <Команда> <Время>]',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    // TODO: Переписать функцию ниже на более нормальный и продуктивный алгоритм.
    function formatTime(seconds) {
      return ms(seconds * 1000)
        .replace('m', ' минут(-ы)')
        .replace('h', ' часа(-ов)')
        .replace('d', ' дня(-ней)');
    }
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'set':
        // eslint-disable-next-line
        const command = args[1];
        if (!data.cooldown[command]) return message.fail('Указанной вами команды не существует либо вы не имеете прав на её редактирование.');

        // eslint-disable-next-line
        const time = ms(args[2]);
        if (!time) return getHelp(message, this.name);
        if (time < 300000 || time > 1000 * 60 * 60 * 24) return message.fail('Время задержки должно быть между **5-ти минут** и **одними сутками**.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            [`cooldown.${command}`]: Math.floor(time / 1000),
          },
        });
        message.reply(`${message.client.constants.emojis.DONE} Задержка команды \`${command}\` была успешно обновлена. Изменения применятся при следующем использовании команды.`);
        break;
      default:
        return message.channel.send(
          new MessageEmbed()
            .setAuthor('Настройка задержек команд', Constants.static.MODULE_GRAY)
            .setColor('ffa500')
            .addField('Текущие настройки', Object.keys(data.cooldown).filter((c) => c !== '$init').map((c) => `**${c}** — ${formatTime(data.cooldown[c])}`).join('\n'), true)
            .addField('Настройка', 'Подробную справку по настройке задержек для команд вы сможете получить на [этой странице](https://docs.flamebot.ru/settings/economy/bazovaya-nastroika#polzovatelskie-zaderzhki-na-komandy).', true)
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp(),
        );
    }
  }
}

module.exports = CooldownCommand;
