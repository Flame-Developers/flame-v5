const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class RemoveItemCommand extends FlameCommand {
  constructor() {
    super('remove-item', {
      description: 'Удалить предмет из магазина сервера.',
      category: 'economy',
      usage: 'remove-item <Роль>',
      aliases: [],
      examples: [
        'f.remove-item 817726510379040799',
        'f.remove-item @Proficient',
      ],
      userPermissions: ['MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });

    if (!role) return getHelp(message, this.name);
    if (!data.items?.find((item) => item.roleId === role.id)) return message.fail('Указанный вами предмет не был найден в магазине данного сервера.');

    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $pull: {
        items: { roleId: role.id },
      },
    });
    message.channel.send(`${message.client.constants.emojis.DONE} Роль **${role.name}** была успешно удалена из магазина сервера.`);
  }
}

module.exports = RemoveItemCommand;
