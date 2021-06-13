const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class KickCommand extends FlameCommand {
  constructor() {
    super('kick', {
      description: 'Выгнать пользователя с сервера.',
      category: 'moderation',
      usage: 'kick <Пользователь> [Причина]',
      aliases: [],
      examples: [
        'f.kick 352756445516660747',
      ],
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
    });
  }

  run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('KICK_MEMBERS') || user.roles.highest.position >= message.member.roles.highest.position) return message.fail('Вы не можете выгнать данного пользователя, потому что у него имеется роль выше вашей/он имеет равные вам права.');
    if (!user.kickable) return message.fail('К сожалению, я не могу выгнать данного пользователя.');

    try {
      message.guild.members.cache.get(user.id).kick(`${message.author.tag}: ${args.slice(1).join(' ') || 'Причина не указана.'}`);
      return message.reply(`${message.client.constants.emojis.DONE} Пользователь **${user.user.tag}** (${user.id}) был успешно выгнан модератором **${message.author.tag}**.`);
    } catch {
      return message.fail('Мне не удалось выгнать указанного вами пользователя.');
    }
  }
}

module.exports = KickCommand;
