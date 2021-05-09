const { getHelp } = require('../../utils/Functions');
const StringParserUtil = require('../../utils/StringParserUtil');
const FlameCommand = require('../../structures/FlameCommand');

class ToggleCommand extends FlameCommand {
  constructor() {
    super('toggle', {
      description: 'Включить/отключить определённую команду на сервере.',
      category: 'settings',
      aliases: [],
      usage: 'toggle <Команда>',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  // eslint-disable-next-line consistent-return
  async run(message, args) {
    if (!args[0]) return getHelp(message, this.name);
    if (!message.client.commands.get(args[0].toLowerCase())) return message.reply('Указанной вами команды не существует :no_entry:');

    const command = message.client.commands.get(args[0].toLowerCase()).name;
    if (['help', 'toggle', 'eval', 'info'].includes(command)) return message.reply('Вы не можете отключить системную команду :no_entry:');

    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (data.disabledCommands.includes(command)) {
      message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
        $pull: {
          disabledCommands: command,
        },
      });
      message.reply(`✅ Команда \`${command}\` была успешно включена на данном сервере.`);
    } else {
      message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
        $push: {
          disabledCommands: command,
        },
      });
      message.reply(`✅ Команда \`${command}\` была успешно отключена на данном сервере.`);
    }
  }
}

module.exports = ToggleCommand;
