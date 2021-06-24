/* eslint-disable radix */
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class SlowmodeCommand extends FlameCommand {
  constructor() {
    super('slowmode', {
      description: 'Устанавливает медленный режим в канале.',
      category: 'moderation',
      usage: 'slowmode <0-21600>',
      aliases: [],
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: [
        'f.slowmode 10',
      ],
    });
  }

  run(message, args) {
    if (!args[0] || isNaN(args[0])) return getHelp(message, this.name);
    if (parseInt(args[0]) < 0 || parseInt(args[0]) > 21600) return message.fail('Время в секундах не должно быть меньше **0** и больше **21600**.');

    message.channel.setRateLimitPerUser(parseInt(args[0]))
      .then(() => message.react(message.client.constants.emojis.DONE))
      .catch(() => message.fail('Не удалось установить медленный режим. Попробуйте позже, либо обратитесь на сервер поддержки, если эта проблема все еще будет актуальной.'));
  }
}

module.exports = SlowmodeCommand;
