const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class PlayInteraction extends FlameInteraction {
  constructor() {
    super('play');
  }

  async run(client, interaction) {
    function _checkURL(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }

    const callback = new InteractionResponse(client);
    const node = client?.shoukaku?.getNode();
    const { query } = interaction.options;

    if (!interaction.member.voice.channelID) {
      return callback.send(
        interaction,
        'Вы должны находится в голосовом канале, для того чтобы использовать данную команду.',
        { flags: 64 },
      );
    }
    if (!node) {
      return callback.send(
        interaction,
        'На текущий момент недоступен никакой из музыкальных серверов.',
        { flags: 64 },
      );
    }

    if (_checkURL(query)) {
      const result = await node.rest.resolve(query);
      if (!result) {
        return callback.send(
          interaction,
          'По вашему запросу не было ничего найдено.',
          { flags: 64 },
        );
      }

      const { type, tracks, playlistName } = result;
      const track = tracks.shift();
      const res = await client.queue.handle(node, track, {
        guild: interaction.guild,
        channel: interaction.channel,
        member: interaction.member,
      });

      if (type == 'PLAYLIST') {
        for (const track of tracks) {
          await client.queue.handle(node, track, {
            guild: interaction.guild,
            channel: interaction.channel,
            member: interaction.member,
          });
        }
      }
      if (res) await res.play();
      return callback.send(
        interaction,
        type == 'PLAYLIST'
          ? `Композиции из плейлиста **${playlistName}** были успешно добавлены в очередь.`
          : `Трек **${track.info.title}** был успешно добавлен в очередь сервера 🎵`,
      );
    }
    const searchData = await node.rest.resolve(query, 'youtube');
    try {
      if (!searchData.tracks.length) {
        return callback.send(
          interaction,
          'По вашему запросу не было ничего найдено.',
          { flags: 64 },
        );
      }

      const track = searchData.tracks.shift();
      const res = await client.queue.handle(node, track, {
        guild: interaction.guild,
        channel: interaction.channel,
        member: interaction.member,
      });

      if (res) res.play();
      return callback.send(
        interaction,
        `Трек **${track.info.title}** был успешно добавлен в очередь сервера 🎵`,
      );
    } catch {
      callback.send(
        interaction,
        'Попытка загрузить трек в очередь завершилась ошибкой. Попробуйте пожалуйста снова.',
        { flags: 64 },
      );
    }
  }
}

module.exports = PlayInteraction;
