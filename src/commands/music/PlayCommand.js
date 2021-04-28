const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class PlayCommand extends FlameCommand {
  constructor() {
    super('play', {
      description: 'Начать проигрывание трека.',
      category: 'music',
      usage: 'play <Запрос/URL>',
      aliases: [],
    });
  }

  async run(message, args) {
    const _checkURL = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
    if (!message.member.voice.channelID) return message.reply('Данная команда доступна только в голосовом канале :no_entry:');
    if (!args.join(' ')) return getHelp(message, this.name);

    const node = message.client.shoukaku.getNode();
    const query = args.join(' ');

    if (_checkURL(query)) {
      const result = await node.rest.resolve(query);
      if (!result) return await message.reply('Ваш запрос не вернул никаких результатов :no_entry:');

      const { type, tracks, playlistName } = result;
      const track = tracks.shift();
      const isPlaylist = type === 'PLAYLIST';
      const res = await message.client.queue.handle(node, track, message);

      if (isPlaylist) {
        for (const track of tracks) await message.client.queue.handle(node, track, message);
      }
      await message.reply(isPlaylist ? `Добавил треки из плейлиста **${playlistName}** в очередь!` : `Трек **${track.info.title}** был успешно добавлен в очередь!`);

      if (res) await res.play();
      return;
    }
    const searchData = await node.rest.resolve(query, 'youtube');

    try {
      if (!searchData.tracks.length) return message.client.queue.get(message.guild.id).destroy();

      const track = searchData.tracks.shift();
      const res = await message.client.queue.handle(node, track, message);

      await message.reply(`Трек **${track.info.title}** был успешно добавлен в очередь!`);
      if (res) await res.play();
    } catch (e) {
      message.reply('Не удалось запустить плеер: возникла неизвестная ошибка :no_entry:');
      return console.warn(e.stack);
    }
  }
}

module.exports = PlayCommand;
