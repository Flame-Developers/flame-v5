const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class CmuteCommand extends FlameCommand {
  constructor() {
    super('cmute', {
      description: 'Замьютить пользователя в определенном канале.',
      category: 'moderation',
      usage: 'cmute <Пользователь> [Канал]',
      aliases: ['channelmute'],
      clientPermissions: ['MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
    });
  }

  run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    // eslint-disable-next-line max-len
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel;

    if (!user || !message.guild.channels.cache.has(channel.id)) return getHelp(message, this.name);
    if (user.permissions.has('MANAGE_CHANNELS') || user.roles.highest.position > message.member.roles.highest.position) return message.reply('Вы не можете замьютить данного пользователя :no_entry:');
    if (!user.permissionsIn(channel).has('SEND_MESSAGES')) return message.reply('Указанный вами пользователь уже замьючен в данном канале :no_entry:');

    channel.updateOverwrite(user, { SEND_MESSAGES: false });
    return message.reply(`✅ Пользователь **${user.user.tag}** (${user.id}) был успешно замьючен в ${channel}.`);
  }
}

module.exports = CmuteCommand;
