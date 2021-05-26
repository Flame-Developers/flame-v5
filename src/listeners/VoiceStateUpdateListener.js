const FlameListener = require('../structures/FlameListener');

class VoiceStateUpdateListener extends FlameListener {
  constructor() {
    super('VoiceStateUpdateListener', { event: 'voiceStateUpdate' });
  }

  async run(client, oldState, newState) {
    if (await oldState.guild.hasPremium()) return;

    const dispatcher = client.queue.get(newState.guild.id);
    if (dispatcher) {
      // eslint-disable-next-line max-len
      if (oldState.channel?.id === dispatcher.player.voiceConnection.voiceChannelID && oldState.channel?.members.filter((m) => !m.user.bot).size === 0) return dispatcher.destroy();
    }
  }
}

module.exports = VoiceStateUpdateListener;
