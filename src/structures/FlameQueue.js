const FlameDispatcher = require('./FlameDispatcher');

class Queue extends Map {
  constructor(client, iterable) {
    super(iterable);
    this.client = client;
  }

  async handle(node, track, message) {
    const existing = this.get(message.guild.id);
    if (!existing) {
      const player = await node.joinVoiceChannel({
        guildID: message.guild.id,
        voiceChannelID: message.member.voice.channelID,
      });
      const dispatcher = new FlameDispatcher({
        client: this.client,
        guild: message.guild,
        text: message.channel,
        player,
      });

      dispatcher.queue.push(track);
      dispatcher.player.setVolume(50);

      this.set(message.guild.id, dispatcher);

      return dispatcher;
    }
    existing.queue.push(track);
    return null;
  }
}

module.exports = Queue;
