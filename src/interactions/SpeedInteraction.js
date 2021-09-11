const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class SpeedInteraction extends FlameInteraction {
  constructor() {
    super('speed', { premium: true });
  }

  run(client, interaction) {
    const callback = new InteractionResponse(client, interaction);

    if (!interaction.member.voice.channelID) return callback.send('Вы должны находится в голосовом канале, для того чтобы использовать данную команду.', { flags: 64 });

    const player = client.players.get(interaction.guild?.id);
    if (!player) return callback.send('На данном сервере не запущен музыкальный плеер.', { flags: 64 });

    if (player?.connection.voiceConnection.voiceChannelID !== interaction.member.voice.channelID) {
      return callback.send(
        'Вы должны находится в одном канале со мной, для того чтобы управлять плеером.',
        { flags: 64 },
      );
    }
    const speed = interaction.options?.value;

    if (Number(speed) < 0 || Number(speed) > 5) return callback.send('Скорость проигрывания не должна быть не менее **1** и не больше **5**.', { flags: 64 });

    player.connection.setTimescale({ speed })
      .then(() => callback.send(`🎚️ Скорость проигрывания трека была успешно установлен на **${speed}**. Изменения должны применится в течении нескольких секунд.`));
  }
}

module.exports = SpeedInteraction;
