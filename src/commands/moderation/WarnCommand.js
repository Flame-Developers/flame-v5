const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class WarnCommand extends FlameCommand {
  constructor() {
    super('warn', {
      description: 'Выдать определённому пользователю предупреждение.',
      category: 'moderation',
      usage: 'warn <Пользователь> [Причина]',
      aliases: [],
      examples: [
        'f.warn @SomeUser#0000 Массовый флуд символами.',
      ],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('MANAGE_MESSAGES') || user.roles.highest.position >= message.member.roles.highest.position) return message.fail('Вы не можете выдать предупреждение данному пользователю.');

    const id = Math.random().toString(36).slice(2, 9)

    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $push: {
        warnings: {
          id,
          user: user.id,
          moderator: message.author.tag,
          reason: args.slice(1).join(' ') || null,
          time: Date.now(),
        },
      },
    });

    return message.channel.send(`${message.client.constants.emojis.DONE} Пользователю **${user.user.tag}** (${user.id}) было успешно выдано предупеждение (ID: \`${id}\`)`);
  }
}

module.exports = WarnCommand;
