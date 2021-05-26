const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/InteractionResponse');

class VolumeInteraction extends FlameInteraction {
  constructor() {
    super('volume');
  }

  run(client, interaction) {
    const callback = new InteractionResponse(client);

    if (!interaction.member.voice.channelID) {
      return callback.send(
        interaction,
        'Вы должны находится в голосовом канале, для того чтобы использовать данную команду.',
        { flags: 64 },
      );
    }
    const dispatcher = client.queue.get(interaction.guild?.id);

    if (!dispatcher) {
      return callback.send(
        interaction,
        'На данном сервере не запущен музыкальный плеер.',
        { flags: 64 },
      );
    }
    if (
      dispatcher?.player.voiceConnection.voiceChannelID
      !== interaction.member.voice.channelID
    ) {
      return callback.send(
        interaction,
        'Вы должны находится в одном канале со мной, для того чтобы управлять плеером.',
        { flags: 64 },
      );
    }

    const volume = interaction.options.value;
    if (!parseInt(volume) || parseInt(volume) < 1 || parseInt(volume) > 200) {
      return callback.send(
        interaction,
        'Значение громкости должно быть от **1** до **200%**.',
        { flags: 64 },
      );
    }

    dispatcher.player.setVolume(parseInt(volume));
    return callback.send(interaction, `🔊 Громкость проигрывания была успешно установлена на **${parseInt(volume)}%**.`);
  }
}

module.exports = VolumeInteraction;
