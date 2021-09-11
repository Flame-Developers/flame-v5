const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class QueueInteraction extends FlameInteraction {
  constructor() {
    super('queue');
  }

  run(client, interaction) {
    const callback = new InteractionResponse(client, interaction);
    const player = client.players.get(interaction.guild?.id);

    if (!player) return callback.send('На данном сервере не запущен музыкальный плеер.', { flags: 64 });
    if (!player.queue?.length) return callback.send('Очередь данного сервере пуста. Добавьте что-нибудь при помощи команды `/play`!');

    switch (interaction.data.options?.[0]?.name) {
      case 'shuffle':
        let { queue } = player;
        // eslint-disable-next-line no-use-before-define
        queue = shuffle(queue);

        callback.send(`🔄 Было успешно перемешано **${queue.length}** треков в очереди сервера!`);
        break;
      case 'list':
        const queueArray = [];
        let count = 0;

        for (const track of player.queue) {
          // eslint-disable-next-line no-plusplus
          queueArray.push(`${++count}. [${track.info.title}](<${track.info.uri}>) (${client.utils.timeout(track.info.length)})`);
        }

        callback.send(
          // eslint-disable-next-line prefer-template
          `Очередь сервера **${interaction.guild.name}**:\n`
          + `Сейчас играет: **${player.current?.info?.title ?? '-'}**\n\n`
          + queueArray.join('\n').slice(0, 1900),
        );
        break;
      default:
    }

    function shuffle(array) {
      let currentIndex = array.length; let temporaryValue; let
        randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }
}

module.exports = QueueInteraction;
