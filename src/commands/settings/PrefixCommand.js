const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class PrefixCommand extends FlameCommand {
  constructor() {
    super('prefix', {
      description: 'Сменить префикс бота на сервере.',
      category: 'settings',
      aliases: [],
      usage: 'prefix <Новый префикс>',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  // eslint-disable-next-line consistent-return
  run(message, args) {
    if (!args[0]) return getHelp(message, this.name);
    if (args[0].length > 3) return message.reply('Длина префикс не должна превышать лимит в 3 символа :no_entry:');
    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $set: {
        prefix: args[0],
      },
    });
    message.channel.send(`✅ Префикс бота на данном сервере был установлен на \`${args[0]}\`.`);
  }
}

module.exports = PrefixCommand;
