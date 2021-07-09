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
    const params = [
      {
        key: 'clearCommandCalls',
        name: 'Удаление вызовов команд',
      },
      {
        key: 'deleteUserAfterLeave',
        name: 'Удаление пользователя при выходе',
      },
      {
        key: 'answerOnDisabledCommands',
        name: 'Отвечать на отключенные команды',
      },
      {
        key: 'hideDisabledCommands',
        name: 'Не отображать отключенные команды',
      },
      {
        key: 'embedErrorMessages',
        name: 'Ошибки в эмбед-сообщениях',
      },
    ];

    const value = params.find((p) => p.key === args[0]);
    if (!value) {
      const embed = new MessageEmbed()
        .setTitle('Конфигурации данного сервера')
        .setColor('ffa500')
        .addField('Подсказка', `Для того, чтобы включить/отключить определенный параметр, выполните эту команду следующим образом: \`${data.prefix}config <Параметр>\`.`)
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      let description = '';
      for (const param of params) {
        description += `[${param.name}](https://docs.flamebot.ru/settings/config-parameters/#${param.key.toLowerCase()}): ${data.settings?.[param.key] ? '✅' : '❌'}\n`;
      }
      embed.setDescription(description);
      return message.channel.send(embed);
    }

    // eslint-disable-next-line max-len
    Object.defineProperty(message.guild.cache.settings, value.key, { value: !data.settings?.[value.key] });
    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $set: {
        [`settings.${value.key}`]: !data.settings?.[value.key],
      },
    });
    message.channel.send(`${message.client.constants.emojis.DONE} Параметр **${value.key}** был успешно обновлен.`);
  }
}

module.exports = ConfigCommand;
