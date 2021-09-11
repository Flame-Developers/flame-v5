const { MessageEmbed } = require('discord.js');
const { version } = require('shoukaku');
const InteractionResponse = require('../../../utils/interactions/InteractionResponse');

class FlamePlayer {
  constructor(client, interaction, connection, options = {}) {
    this.client = client;
    this.interaction = interaction;
    this.connection = connection;
    this.node = connection.voiceConnection.node;
    this.current = undefined;
    this.options = options;
    this.queue = options.queue ?? [];
    this.loop = options.loop ?? false;
    this.callback = new InteractionResponse(client, interaction);

    this._handleEvents();
  }

  play() {
    if (!this.queue.length) {
      this.destroy();
      return this.interaction.channel.send(
        new MessageEmbed()
          .setTitle('Очередь сервера закончилась')
          .setDescription('Я покинул канал, поскольку в очереди больше не осталось треков. Воспользуйтесь командой `/play` чтобы возобновить проигрывание.')
          .setColor('ffa500'),
      );
    }
    // eslint-disable-next-line prefer-destructuring
    this.current = this.queue[0];
    this.connection.playTrack(this.current.track)
      .catch(console.error);
  }

  destroy() {
    this.queue = [];
    this.client.players.delete(this.interaction.guild?.id);
    return this.connection?.disconnect();
  }

  _createEmbed() {
    const { isStream, length, identifier } = this.current.info;

    return new MessageEmbed()
      .setTitle(this.current.info.title ?? 'Unknown')
      .setColor('ffa500')
      .setAuthor(this.current.info?.uri)
      .setThumbnail(`https://i.ytimg.com/vi/${identifier}/maxresdefault.jpg`)
      .setURL(this.current.info?.uri)
      .addField('Прямая трансляция?', isStream ? 'Да' : 'Нет', true)
      .addField('Статус проигрывания:', `▶️ \`${!isStream ? `\`--:--:-- / ${this.client.utils.timeout(length)}\`` : '--:--:--'}\``, true)
      .setFooter(`Всего активных плееров: ${this.node.stats?.playingPlayers ?? 0}; Потребление памяти: ${(this.node.stats?.memory.used / 1024 ** 2).toFixed(1)}MB; shoukaku v${version}.`);
  }

  _handleEvents() {
    for (const event of ['closed', 'error', 'nodeDisconnect']) {
      this.connection.on(event, () => {
        this.destroy();
        return this.interaction.channel.send(
          new MessageEmbed()
            .setTitle('Ошибка при произведении')
            .setDescription('При проигрывании данного трека возникла ошибка либо соединение было разорвано. Посетите [данную страницу](https://docs.flamebot.ru/faq) для полного списка возможных причин.')
            .setColor('ff3333'),
        );
      });
    }

    this.connection.on('start', async () => {
      const res = await this.callback.followUp(undefined, { embeds: [this._createEmbed()] });
      const { timeout } = this.client.utils;
      
      this._updateInterval = setInterval(() => {
        res.embeds[0].fields[1].value = `${this.connection.paused ? '⏸️' : '▶️'} \`${timeout(this.connection.position)} / ${this.current.info.isStream ? '--:--:--' : timeout(this.current.info.length)}\``;
        // eslint-disable-next-line max-len
        this.client.api.webhooks(this.client.user.id, this.interaction.token).messages(res.id).patch({
          data: {
            embeds: [res.embeds[0]],
          },
        }).catch(() => undefined);
      }, 3000);
    });
    this.connection.on('end', () => {
      clearInterval(this._updateInterval);

      if (!this.loop) this.queue.shift();
      this.play();
    });
  }
}

module.exports = FlamePlayer;
