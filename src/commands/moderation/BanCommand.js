const ActionConfirmationUtil = require('../../utils/misc/ActionConfirmationUtil');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class BanCommand extends FlameCommand {
  constructor() {
    super('ban', {
      description: 'Забанить пользователя на сервере.',
      category: 'moderation',
      usage: 'ban <Пользователь> [Причина]',
      aliases: [],
      examples: [
        'f.ban 352756445516660747 Спам-рассылка.',
      ],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('BAN_MEMBERS') || user.roles.highest.position >= message.member.roles.highest.position) return message.fail('Вы не можете забанить данного пользователя, потому что у него имеется роль выше вашей/он имеет равные вам права.');
    if (!user.bannable) return message.fail('К сожалению, я не могу забанить данного пользователя.');

    await new ActionConfirmationUtil(message.client, message.author).init(`Вы уверены, что хотите забанить пользователя **${user.user.tag}**? У вас есть **30** секунд на решение.`, message.channel).then(async (response) => {
      if (response) {
        try {
          await message.guild.members.ban(user.id, { days: 1, reason: args.slice(1).join(' ').length ? args.slice(1).join(' ').slice(0, 499) : null });
          message.channel.send(`${message.client.constants.emojis.DONE} Пользователь **${user.user.tag}** (${user.id}) был успешно забанен.`);
        } catch {
          message.fail('Мне не удалось забанить данного пользователя.');
        }
      } else message.fail('Процесс блокировки был отменен.');
    });
  }
}

module.exports = BanCommand;
