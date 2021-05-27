const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class BassInteraction extends FlameInteraction {
  constructor() {
    super('bass');
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

    const level = interaction.options.value;
    let band;

    switch (level) {
      case 'off':
        band = Array(6)
          .fill(0)
          .map((n, i) => ({ band: i, gain: 0.0 }));
        break;
      case 'low':
        band = Array(6)
          .fill(0)
          .map((n, i) => ({ band: i, gain: 0.05 }));
        break;
      case 'medium':
        band = Array(6)
          .fill(0)
          .map((n, i) => ({ band: i, gain: 0.25 }));
        break;
      case 'max':
        band = Array(6)
          .fill(0)
          .map((n, i) => ({ band: i, gain: 0.4 }));
        break;
      case 'ultra':
        band = Array(6)
          .fill(0)
          .map((n, i) => ({ band: i, gain: 2.5 }));
        break;
    }

    dispatcher.player.setEqualizer(band).catch();
    return callback.send(
      interaction,
      level === 'off'
        ? '🎚️ Эффект басса был успешно отключен.'
        : '🎚️ Эффект басса был успешно установлен. Через несколько секунд изменения применятся к текущему треку.',
    );
  }
}

module.exports = BassInteraction;
