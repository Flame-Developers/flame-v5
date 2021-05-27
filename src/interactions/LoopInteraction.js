const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class LoopInteraction extends FlameInteraction {
  constructor() {
    super('loop');
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

    const { value } = interaction.options;
    let loop;

    switch (value) {
      case 'off':
        loop = 'off';
        break;
      case 'single':
        loop = 1;
        break;
      case 'all':
        loop = 2;
        break;
    }

    dispatcher.loop = loop;
    return callback.send(interaction, loop !== 'off' ? '🔁 Повторное проигрывание было успешно включено.' : '🔁 Повторное проигрывание было успешно отключено.');
  }
}

module.exports = LoopInteraction;
