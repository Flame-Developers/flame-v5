const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class StopInteraction extends FlameInteraction {
  constructor() {
    super('stop');
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

    player.destroy();
    return callback.send(`⏹️ Проигрывание треков было остановлено пользователем **${interaction.member.user.tag}**.`);
  }
}

module.exports = StopInteraction;
