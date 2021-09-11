const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class RotationInteraction extends FlameInteraction {
  constructor() {
    super('rotation', { premium: true });
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
    const rotation = interaction.options?.value;

    if (parseInt(rotation) < 0 || parseInt(rotation) > 5) return callback.send('Уровень ротации должен быть не менее **1** и не больше **5**.', { flags: 64 });

    player.connection.setRotation({ rotationHz: parseInt(rotation) })
      .then(() => callback.send(`🎚️ Уровень ротации был успешно установлен на **${parseInt(rotation)}**. Изменения должны применится в течении нескольких секунд.`));
  }
}

module.exports = RotationInteraction;
