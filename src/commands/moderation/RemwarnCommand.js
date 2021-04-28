const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class RemwarnCommand extends FlameCommand {
  constructor() {
    super('remwarn', {
      description: 'Удалить определенное предупреждение.',
      category: 'moderation',
      usage: 'remwarn <Случай>',
      aliases: ['unwarn', 'removewarn'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(message, args) {
    const id = args[0];

    if (!id) return getHelp(message, this.name);
    if (isNaN(id) || !parseInt(id) || parseInt(id) <= 0) return message.reply('Укажите пожалуйста **верный** случай :no_entry:');

    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const warn = data?.warnings.find((r) => r.id == parseInt(id));

    if (!warn) return message.reply('Указанный вами случай не был найден в базе данного сервера :no_entry:');
    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $pull: {
        warnings: { id: parseInt(id) },
      },
    });

    return message.channel.send(`✅ Предупреждение \`#${id}\` было успешно удалено.`);
  }
}

module.exports = RemwarnCommand;
