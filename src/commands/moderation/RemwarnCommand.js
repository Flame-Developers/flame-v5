const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class RemwarnCommand extends FlameCommand {
  constructor() {
    super('remwarn', {
      description: 'Удалить определённое предупреждение.',
      category: 'moderation',
      usage: 'remwarn <Случай>',
      aliases: ['unwarn', 'removewarn'],
      examples: [
        'f.remwarn blxoj0g',
      ],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(message, args) {
    const id = args[0];

    if (!id) return getHelp(message, this.name);

    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const warn = data?.warnings.find((r) => r.id === id);

    if (!warn) return message.fail('Указанное вами предупреждение не было найдено в списке предупреждений данного сервера.');
    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $pull: {
        warnings: { id },
      },
    });

    return message.channel.send(`${message.client.constants.emojis.DONE} Предупреждение \`#${id}\` было успешно удалено.`);
  }
}

module.exports = RemwarnCommand;
