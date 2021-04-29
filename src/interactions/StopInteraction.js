const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/InteractionResponse');

class StopInteraction extends FlameInteraction {
  constructor() {
    super('stop');
  }
  run(client, interaction) {
    const callback = new InteractionResponse(client);

    if (!interaction.member.voice.channelID)
      return callback.send(
        interaction,
        'Вы должны находится в голосовом канале, для того чтобы использовать данную команду.',
        { flags: 64 }
      );
    const dispatcher = client.queue.get(interaction.guild?.id);

    if (!dispatcher)
      return callback.send(
        interaction,
        'На данном сервере не запущен музыкальный плеер.',
        { flags: 64 }
      );
    if (
      dispatcher?.player.voiceConnection.voiceChannelID !==
      interaction.member.voice.channelID
    )
      return callback.send(
        interaction,
        'Вы должны находится в одном канале со мной, для того чтобы управлять плеером.',
        { flags: 64 }
      );

    dispatcher.destroy();
    return callback.send(
      interaction,
      `⏹️ Проигрывание треков было остановлено пользователем **${interaction.member.user.tag}**.`
    );
  }
}

module.exports = StopInteraction;
