const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class LoopCommand extends FlameCommand {
  constructor() {
    super('loop', {
      description: 'Включить/выключить повторение треков в очереди.',
      category: 'music',
      usage: 'loop <off/single/all>',
      aliases: [],
    });
  }

  run(message, args) {
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');

    const dispatcher = message.client.queue.get(message.guild.id);

    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');
    if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID) return message.reply('Вы можете прописать данную команду только в том канале, в котором я нахожусь :no_entry:');

    let mode;
    switch (args[0]) {
      case 'off':
        mode = 0;
        break;
      case 'single':
        if (dispatcher.current.info.length < 15000) return message.reply('Вы не можете применить это на данном треке :no_entry:');
        mode = 1;
        break;
      case 'all':
        mode = 2;
        break;

      default:
        return getHelp(message, this.name);
    }

    dispatcher.loop = mode;
    return message.react('✅');
  }
}

module.exports = LoopCommand;
