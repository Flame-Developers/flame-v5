const FlameCommand = require('../../structures/FlameCommand');

class PauseCommand extends FlameCommand {
  constructor() {
    super('pause', {
      description: 'Поставить плеер на паузу.',
      category: 'music',
      usage: 'pause',
      aliases: [],
    });
  }

  run(message, args) {
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');

    const dispatcher = message.client.queue.get(message.guild.id);

    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');
    if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID) return message.reply('Вы можете прописать данную команду только в том канале, в котором я нахожусь :no_entry:');

    dispatcher.player.setPaused((dispatcher.player.paused === false));
    return message.react('✅');
  }
}

module.exports = PauseCommand;
