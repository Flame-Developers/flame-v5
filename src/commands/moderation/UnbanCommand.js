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

      if (!member) return message.fail('Указанный вами пользователь не был найден в списке банов данного сервера.');
      try {
        message.guild.members.unban(member.user.id);
        return message.channel.send(`${message.client.constants.emojis.DONE} Пользователь **${member?.user.tag}** был успешно разбанен модератором **${message.author.tag}**.`);
      } catch {
        return message.fail('Мне не удалось разбанить указанного вами пользователя.');
      }
    });
  }
}

module.exports = UnbanCommand;
