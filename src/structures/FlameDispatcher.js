const { MessageEmbed } = require('discord.js');
const { msToTime } = require('../utils/Functions');

class FlameDispatcher {
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.text = options.text;
    this.player = options.player;
    this.author = options.author;
    this.queue = [];
    this.current = null;
    this.loop = 0;

    this.player.on('start', () => {
      this.text.send(
        new MessageEmbed()
          .setTitle(this.current.info.title)
          .setURL(this.current.info.uri)
          .setDescription('Текущий трек в очереди сервера.')
          .setThumbnail(this.guild.iconURL({ dynamic: true, size: 2048 }))
          .setColor('ffa500')
          .addField('Прямая трансляция?', this.current.info.isStram ? 'Да' : 'Нет', true)
          .addField('Длинна трека', msToTime(this.current.info.length), true)
          .setFooter(this.guild.name, this.guild.iconURL())
          .setTimestamp(),
      );
    });

    this.player.on('end', () => {
      if (this.loop !== 1) {
        if (this.loop == 2) this.queue.push(this.queue[0]);
        this.queue.shift();
      }

      this.play()
        .catch(() => {
          this.text.send('Произошла неизвестная ошибка при проигрывании данного трека :no_entry:');
          return this.destroy();
        });
    });

    for (const playerEvent of ['closed', 'error', 'nodeDisconnect']) {
      this.player.on(playerEvent, (data) => {
        if (data instanceof Error || data instanceof Object) console.log(data);
        this.queue.length = 0;
        this.destroy('Меня отключили от голосового канала, либо при проигрывании данного трека что-то сломалось.');
      });
    }
  }

  get exists() {
    return this.client.queue.has(this.guild.id);
  }

  async play() {
    if (!this.exists || !this.queue.length) return this.destroy();
    this.current = this.queue[0];
    await this.player.playTrack(this.current.track);
  }

  destroy(message) {
    this.queue.length = 0;
    this.player.disconnect();
    this.client.queue.delete(this.guild.id);
    return this.text.send(message || 'Очередь сервера закончилась, в канале не осталось слушаталей, либо плеер был остановлен вручную. Покидаю канал…');
  }
}

module.exports = FlameDispatcher;
