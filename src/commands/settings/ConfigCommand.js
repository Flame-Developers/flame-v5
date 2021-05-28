const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class ConfigCommand extends FlameCommand {
  constructor() {
    super('config', {
      description: 'Управление параметрами базовой конфигурации бота.',
      category: 'settings',
      usage: 'config [Параметр]',
      aliases: ['settings'],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const params = ['clearCommandCalls', 'deleteUserAfterLeave', 'answerOnDisabledCommands', 'hideDisabledCommands'];

    const value = args[0];
    if (!value) {
      const embed = new MessageEmbed()
        .setTitle('Конфигурации данного сервера')
        .setColor('ffa500')
        .setDescription(`Для того, чтобы включить/отключить определенный параметр, введите эту команду следующим образом: \`${data.prefix}config <Параметр>\`.`)
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      for (const param of params) {
        embed.addField(param, `**Состояние:** ${data?.settings?.[param] ? message.client.constants.emojis.TOGGLE_ON : message.client.constants.emojis.TOGGLE_OFF}`, true);
      }
      return message.channel.send(embed);
    }
    if (!params.includes(value)) return message.reply('Указанного вами параметра не существует :no_entry:');

    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $set: {
        [`settings.${value}`]: !data?.settings?.[value],
      },
    });
    message.channel.send(`✅ Параметр **${value}** был успешно обновлен.`);
  }
}

module.exports = ConfigCommand;
