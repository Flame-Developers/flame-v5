const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class UnbanCommand extends FlameCommand {
  constructor() {
    super('unban', {
      description: 'Разбанить определённого пользователя.',
      category: 'moderation',
      usage: 'unban <ID>',
      aliases: [],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });
  }

  run(message, args) {
    const id = args[0];

    if (!id) return getHelp(message, this.name);
    message.guild.fetchBans().then((bans) => {
      const member = bans.get(id);

      if (!member) return message.reply('Указанный вами пользователь не был найден в списке банов данного сервера :no_entry:');
      try {
        message.guild.members.unban(member.user.id);
        return message.channel.send(`✅ Пользователь **${member?.user.tag}** был успешно разбанен модератором **${message.author.tag}**.`);
      } catch {
        return message.channel.send('Мне не удалось разбанить указанного вами пользователя :no_entry:');
      }
    });
  }
}

module.exports = UnbanCommand;
