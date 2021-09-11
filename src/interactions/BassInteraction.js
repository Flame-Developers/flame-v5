const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class BassInteraction extends FlameInteraction {
  constructor() {
    super('bass');
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

    const { level } = interaction.options;
    const levels = {
      off: { name: 'Минимальный', gain: 0.0 },
      low: { name: 'Низкий', gain: 0.15 },
      medium: { name: 'Средний', gain: 0.35 },
      high: { name: 'Высокий', gain: 1 },
      max: { name: 'Максимальный', gain: 2 },
    };

    player.connection
      .setEqualizer(Array(6).fill(0).map((n, i) => ({ band: i, gain: levels[level].gain })))
      .then(() => callback.send(`🎚️ Уровень басса был успешно установлен на **${levels[level].name}**. Изменения применятся через несколько секунд.`));
  }
}

module.exports = BassInteraction;
