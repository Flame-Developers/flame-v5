const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class KickCommand extends FlameCommand {
  constructor() {
    super('kick', {
      description: 'Выгнать пользователя с сервера.',
      category: 'moderation',
      usage: 'kick <Пользователь> [Причина]',
      aliases: [],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
    });
  }

  run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('KICK_MEMBERS') || user.roles.highest.position >= message.member.roles.highest.position) return message.reply('Вы не можете выгнать данного пользователя, потому что у него имеется роль выше вашей/он имеет равные вам права :no_entry:');
    if (!user.kickable) return message.reply('К сожалению, я не могу выгнать данного пользователя :no_entry:');

    try {
      message.guild.members.cache.get(user.id).kick(`${message.author.tag}: ${args.slice(1).join(' ') || 'Причина не указана.'}`);
      return message.reply(`✅ Пользователь **${user.user.tag}** (${user.id}) был успешно выгнан модератором **${message.author.tag}**.`);
    } catch {
      return message.reply('Мне не удалось выгнать указанного вами пользователя :no_entry:');
    }
  }
}

module.exports = KickCommand;
