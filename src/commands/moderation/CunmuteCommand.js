const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class CunmuteCommand extends FlameCommand {
  constructor() {
    super('cunmute', {
      description: 'Снять с пользователя мьют в определённом канале.',
      category: 'moderation',
      usage: 'cunmute <Пользователь> [Канал]',
      aliases: ['channelunmute'],
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
    });
  }

  run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;

    if (!user || !message.guild.channels.cache.has(channel.id)) return getHelp(message, this.name);
    if (user.permissionsIn(channel).has('SEND_MESSAGES')) return message.reply('Указанный вами пользователь не замьючен в данном канале :no_entry:');

    channel.updateOverwrite(user, { SEND_MESSAGES: null });
    return message.reply(`✅ С пользователя **${user.user.tag}** (${user.id}) был успешно снят мьют в ${channel}.`);
  }
}

module.exports = CunmuteCommand;
