const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class ModroleCommand extends FlameCommand {
  constructor() {
    super('modrole', {
      description: 'Установить роль модератора на сервере.',
      category: 'settings',
      aliases: [],
      usage: 'modrole [reset/set <Роль>]',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'set':
        // eslint-disable-next-line no-case-declarations
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) return getHelp(message, this.name);
        if (!message.guild.roles.cache.has(role.id)) return message.fail('Указанной вами роли не существует на данном сервере.');

        message.guild.cache.set('moderator', role.id);
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            moderator: role.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль модератора была успешно установлена на **${role.name}** (${role.id})`);
        break;
      case 'reset':
        if (!data.moderator) return message.fail('На данном сервере не установлена роль модератора.');

        message.guild.cache.set('moderator', null);
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            moderator: null,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль модератора была успешно сброшена.`);
        break;
      default:
        return message.channel.send(data.moderator
          ? `Роль модератора на данном сервере установлена на **${data.moderator}**\nСбросить её можно командой \`${data.prefix}modrole reset\`.`
          : `На данном сервере ещё не установлена роль модератора.\nВы всегда можете установить её командой \`${data.prefix}modrole set\`.`,
        );
    }
  }
}

module.exports = ModroleCommand;
