const FlameListener = require('../structures/FlameListener');
const { MessageEmbed } = require('discord.js');

class VoiceStateUpdateListener extends FlameListener {
  constructor() {
    super('VoiceStateUpdateListener', { event: 'voiceStateUpdate' });
  }

  async run(client, oldState, newState) {
    if (oldState.guild.cache?.premium) return;

    const player = client.players.get(newState.guild.id);
    if (player) {
      // eslint-disable-next-line max-len
      if (oldState.channel?.id === player.connection.voiceConnection.voiceChannelID && oldState.channel?.members.filter((m) => !m.user.bot).size === 0) {
        player.interaction.channel.send(
          new MessageEmbed()
            .setTitle('В канале не осталось слушателей')
            .setColor('ff3333')
            .setDescription('Я покинул канал, поскольку в нем больше не осталось слушателей. Приобретите подписку [Flame+](https://docs.flamebot.ru/flame+) для возможности прослушивать музыку 24/7.'),
        );
        player.destroy();
      }
    }
  }
}

module.exports = VoiceStateUpdateListener;
