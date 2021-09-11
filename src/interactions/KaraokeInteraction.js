const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require("../utils/interactions/InteractionResponse");

class KaraokeInteraction extends FlameInteraction {
  constructor() {
    super('karaoke', { premium: true });
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

    const { mode } = interaction.options;
    const modes = {
      default: { name: 'Стандартный', level: 2 },
      deep: { name: 'Глубокий', level: 1 },
    };

    player.connection.setKaraoke(mode === 'off' ? null : { level: modes[mode].level })
      .then(() => callback.send(`🎙️ Эффект караоке был успешно ${mode === 'off' ? 'отключен' : `установлен на уровень **${modes[mode].name}**`}. Изменения должны применится в течении нескольких секунд.`));
  }
}

module.exports = KaraokeInteraction;
