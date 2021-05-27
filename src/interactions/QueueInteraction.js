const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class QueueInteraction extends FlameInteraction {
  constructor() {
    super('queue');
  }

  run(client, interaction) {
    const callback = new InteractionResponse(client);
    const dispatcher = client.queue.get(interaction.guild.id);

    if (!dispatcher) {
      return callback.send(
        interaction,
        'На данном сервере не запущен музыкальный плеер.',
        { flags: 64 },
      );
    }

    const array = [];
    array.push(`Сейчас играет: ${dispatcher.current.info.title} ${dispatcher.loop == 1 ? '🔁' : ''}\n`);

    for (const track of dispatcher.queue) {
      array.push(track.info.title);
    }

    return callback.send(
      interaction,
      `\`\`\`fix\n${
        !array.length
          ? 'Очередь данного сервера пуста.'
          : array.join('\n').slice(0, 1999)
      }\`\`\``,
    );
  }
}

module.exports = QueueInteraction;
