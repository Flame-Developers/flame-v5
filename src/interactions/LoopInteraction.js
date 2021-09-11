const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class LoopInteraction extends FlameInteraction {
  constructor() {
    super('loop');
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

    player.loop = player.loop === false;
    return callback.send(player.loop ? `🔁 Повторное проигрывание было успешно активировано пользователем **${interaction.member.user.tag}**` : '🔁 Повторное проигрывание было отключено.');
  }
}

module.exports = LoopInteraction;
