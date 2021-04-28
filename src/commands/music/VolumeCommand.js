const FlameCommand = require('../../structures/FlameCommand');

class VolumeCommand extends FlameCommand {
  constructor() {
    super('volume', {
      description: 'Изменить громкость проигрывания.',
      category: 'music',
      usage: 'volume <1-200>',
      aliases: [],
    });
  }

  run(message, args) {
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');

    const dispatcher = message.client.queue.get(message.guild.id);

    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');
    if (dispatcher.player.voiceConnection.voiceChannelID !== message.member.voice.channelID) return message.reply('Вы можете прописать данную команду только в том канале, в котором я нахожусь :no_entry:');

    const volume = args[0];
    if (!volume || isNaN(volume) || !parseInt(volume)) return message.reply(`Громкость воспроизведения треков на данный момент **${dispatcher.player.volume}%** :musical_note:`);
    if (parseInt(volume) < 1 || parseInt(volume) > 200) return message.reply('Громкость плеера должна быть в диапазоне от **1** до **200**% :no_entry:');

    dispatcher.player.setVolume(parseInt(args[0]));
    return message.react('✅');
  }
}

module.exports = VolumeCommand;
