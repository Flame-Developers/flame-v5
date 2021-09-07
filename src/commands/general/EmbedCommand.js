const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class EmbedCommand extends FlameCommand {
  constructor() {
    super('embed', {
      description: 'Отправить embed-сообщение от лица бота.',
      category: 'general',
      usage: 'embed <Структура>',
      cooldown: 0,
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['EMBED_LINKS'],
      aliases: ['say'],
    });
  }

  run(message, args) {
    if (!args.join(' ')) return getHelp(message, this.name);
    if (!message.guild.cache?.settings?.clearCommandCalls) message.delete();

    let embed;
    try {
      embed = JSON.parse(args.join(' '));
    } catch {
      return message.channel.send(`${message.client.constants.emojis.FAIL} Произошла ошибка при валидации JSON-структуры. Попробуйте сгенерировать ее на сайте (<https://embed.yoba.fun>) либо обратится на сервер поддержки.`);
    }

    return message.channel.send(embed.plainText, { embed })
      .catch(() => {
        message.channel.send(`${message.client.constants.emojis.FAIL} Произошла ошибка при отправке сообщения. Убедитесь, что embed-сообщение попадает под стандарты и требования Discord (<https://discord.com/developers/docs/resources/channel#embed-object>)`)
      });
  }
}

module.exports = EmbedCommand;
