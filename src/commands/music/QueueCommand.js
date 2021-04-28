const FlameCommand = require('../../structures/FlameCommand');

class QueueCommand extends FlameCommand {
  constructor() {
    super('queue', {
      description: 'Возвращает очередь треков сервера.',
      category: 'music',
      usage: 'queue',
      aliases: [],
    });
  }

  run(message, args) {
    const dispatcher = message.client.queue.get(message.guild.id);
    if (!dispatcher) return message.reply('На данный момент ничего не воспроизводится :no_entry:');

    const list = [];
    list.push(`Сейчас играет: ${dispatcher.current.info.title}\n`);

    for (const track of message.client.queue.get(message.guild.id).queue) {
      list.push(track.info.title);
    }

    return message.reply(
      (list.length <= 0) ? 'В очереди ничего нет. Добавьте-же какой-то трек!' : list.join('\n'),
      { code: 'fix' },
    );
  }
}

module.exports = QueueCommand;
