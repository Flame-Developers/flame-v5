const FlameCommand = require('../../structures/FlameCommand');

class StopCommand extends FlameCommand {
  constructor() {
    super('stop', {
      description: 'Остановить проигрывание музыки и уничтожить плеер.',
      category: 'music',
      usage: 'stop',
      aliases: [],
    });
  }

  run(message, args) {
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');

    const dispatcher = message.client.queue.get(message.guild.id);

    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');
    if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID) return message.reply('Вы можете прописать данную команду только в том канале, в котором я нахожусь :no_entry:');

    dispatcher.destroy();
    return message.react('✅');
  }
}

module.exports = StopCommand;
