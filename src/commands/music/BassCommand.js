const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class BassCommand extends FlameCommand {
  constructor() {
    super('bass', {
      description: 'Применить эффект басса.',
      category: 'music',
      usage: 'bass <off/low/medium/max/ultra>',
      aliases: [],
    });
  }

  run(message, args) {
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');

    const dispatcher = message.client.queue.get(message.guild.id);

    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');
    if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID) return message.reply('Вы можете прописать данную команду только в том канале, в котором я нахожусь :no_entry:');

    let band;
    switch (args[0]) {
      case 'off':
        band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.00 }));
        break;
      case 'low':
        band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.05 }));
        break;
      case 'medium':
        band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.25 }));
        break;
      case 'max':
        band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.40 }));
        break;
      case 'ultra':
        band = Array(6).fill(0).map((n, i) => ({ band: i, gain: 2.50 }));
        break;

      default:
        return getHelp(message, this.name);
    }

    dispatcher.player.setEqualizer(band);
    return message.reply(args[0] == 'off' ? 'Эффект басса был успешно отключен. Через несколько секунд изменения применятся на текущую очередь.' : `Эффект басса установлен на **${args[0]}**. Через несколько секунд эффект применится на текущую очередь.`);
  }
}

module.exports = BassCommand;
