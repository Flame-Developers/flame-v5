const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class VolumeInteraction extends FlameInteraction {
  constructor() {
    super('volume');
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
    const volume = interaction.options?.value;

    if (parseInt(volume) < 1 || parseInt(volume) > 10) return callback.send('Уровень громкости должен быть не менее **1** и не больше **10**.', { flags: 64 });

    player.connection.setVolume(parseInt(volume));
    return callback.send(`🔊 Уровень громкости был установлен на **${parseInt(volume)}**.`);
  }
}

module.exports = VolumeInteraction;
