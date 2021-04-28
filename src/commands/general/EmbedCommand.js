const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class EmbedCommand extends FlameCommand {
  constructor() {
    super('embed', {
      description: 'Отправить embed-сообщение от лица бота.',
      category: 'general',
      usage: 'embed <Структура>',
      cooldown: 0,
      userPermissions: ['ADMINISTRATOR'],
      aliases: [],
    });
  }

  run(message, args) {
    if (!args.join(' ')) return getHelp(message, this.name);

    try {
      message.delete();
      const embed = JSON.parse(args.join(' '));

      return embed.plainText ? message.channel.send(embed.plainText, { embed }) : message.channel.send({ embed });
    } catch {
      return message.reply('Вы указали неверный объект сообщния. Попробуйте сгенерировать его на сайте :no_entry:');
    }
  }
}

module.exports = EmbedCommand;
