const FlameInteraction = require('../structures/FlameInteraction');
const FlamePlayer = require('../structures/music/player/FlamePlayer');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class PlayInteraction extends FlameInteraction {
  constructor() {
    super('play');
  }

  async run(client, interaction) {
    const callback = new InteractionResponse(client, interaction);
    const node = client.shoukaku?.getNode();

    const { query, search } = interaction.options;

    if (!interaction.member.voice.channelID) return callback.send('Вы должны находится в голосовом канале, для того чтобы использовать данную команду.', { flags: 64 });
    if (!node) return callback.send('На текущий момент недоступен никакой из музыкальных серверов. Обратитесь на сервер поддержки за решением данной проблемы.', { flags: 64 });

    const allowedLinks = [
      /* Whitelisted and safe radios */
      'radiorecord.hostingradio.ru',
      'online.hitfm.ua',
      'cast.nrj.in.ua',
      'cast2.nrj.in.ua',
      'online.kissfm.ua',
      'online.radioroks.ua',
      'hermitage.hostingradio.ru',
      /* Safe audio/video hosts */
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'twitch.tv',
      'plays.tv',
      'streamable.com',
      'bandcamp.com',
      'soundcloud.com',
      'open.spotify.com',
      'spotify.com',
      'yandex.ru',
      'music.yandex.ru',
      'discordapp.com',
      'cdn.discordapp.com',
    ];
    // eslint-disable-next-line no-use-before-define
    if (isUrl(query)) {
      const url = new URL(query);
      if (!allowedLinks.includes(url.host)) return callback.send('Указанная вами ссылка не находится в списке разрешенных. Посетите FAQ для возможности внести ее в список разрешенных.', { flags: 64 });
    }

    const result = await node.rest.resolve(query, search);
    if (!result) return callback.send('Ваш запрос не вернул никаких результатов. Вы точно указали необходимую платформу для поиска?', { flags: 64 });

    const { type, tracks, playlistName } = result;
    const track = tracks.shift();

    if (!track) return callback.send('Не удалось получить запрашиваемый трек.', { flags: 64 });
    let player = client.players.get(interaction.guild.id);

    if (!player) {
      const connection = await node.joinVoiceChannel({
        guildID: interaction.guild.id,
        voiceChannelID: interaction.member.voice.channelID,
      });
      player = new FlamePlayer(client, interaction, connection);
      client.players.set(interaction.guild.id, player);
    }

    if (type === 'PLAYLIST') {
      for (const singleTrack of tracks) {
        player.queue.push(singleTrack);
      }
    } else player.queue.push(track);

    callback.send(
      `🎵 ${type === 'PLAYLIST' 
        ? `Успешно загрузил **${tracks.length}** треков из плейлиста **${playlistName}**.` 
        : `Трек **${track?.info?.title ?? 'Unknown'}** по запросу **${interaction.member.user.tag}** был успешно добавлен в очередь.
        `}`,
    );

    await player.play();

    function isUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    }
  }
}

module.exports = PlayInteraction;
