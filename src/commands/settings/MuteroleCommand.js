const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class MuteroleCommand extends FlameCommand {
  constructor() {
    super('muterole', {
      description: 'Установить роль мьюта на сервере.',
      category: 'settings',
      aliases: [],
      usage: 'muterole [reset/set <Роль>]',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'set':
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!role) return getHelp(message, this.name);
        if (!message.guild.roles.cache.has(role.id)) return message.fail('Указанной вами роли не существует на данном сервере.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            muteRole: role.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль мьюта была успешно установлена на ${role} (${role.id})`);
        break;
      case 'reset':
        if (!data.muteRole) return message.fail('На данном сервере не установлена роль мьюта.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            muteRole: null,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль мьюта была успешно сброшена.`);
        break;
      default:
        return message.channel.send(data.muteRole
          ? `Роль мьюта на данном сервере установлена на <@&${data.muteRole}> (${data.muteRole})\nСбросить её можно командой \`${data.prefix}muterole reset\`.`
          : `На данном сервере ещё не установлена роль мьюта.\nВы всегда можете установить её командой \`${data.prefix}muterole set\`.`,
        );
    }
  }
}

module.exports = MuteroleCommand;
