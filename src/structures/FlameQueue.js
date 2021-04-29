const FlameDispatcher = require('./FlameDispatcher');

class Queue extends Map {
  constructor(client, iterable) {
    super(iterable);
    this.client = client;
  }

  async handle(node, track, options = {}) {
    const existing = this.get(options?.guild.id);
    if (!existing) {
      const player = await node.joinVoiceChannel({
        guildID: options?.guild.id,
        voiceChannelID: options?.member.voice.channelID,
      });
      const dispatcher = new FlameDispatcher({
        client: this.client,
        guild: options?.guild,
        text: options?.channel,
        player,
      });

      dispatcher.queue.push(track);
      dispatcher.player.setVolume(50);

      this.set(options?.guild.id, dispatcher);

      return dispatcher;
    }
    existing.queue.push(track);
    return null;
  }
}

module.exports = Queue;
