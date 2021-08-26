const { MessageEmbed } = require('discord.js');
const Constants = require('../../utils/Constants');
const FlameCommand = require('../../structures/FlameCommand');

class LeaverCommand extends FlameCommand {
  constructor() {
    super('leaver', {
      description: 'Управление модулем уведомлений об ушедших участниках.',
      category: 'settings',
      aliases: [],
      usage: 'leaver [toggle/channel/message]',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];
    // eslint-disable-next-line default-case
    switch (option) {
      case 'toggle':
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'leave.enabled': !data.leave.enabled,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Система уведомлений об ушедших участников была успешно **${data.leave.enabled ? 'отключена' : 'включена'}** на данном сервере.`);
        break;
      case 'channel':
        if (!data.leave.enabled) return message.fail('На данном сервере ещё не включена система уведомлений об ушедших участниках. Включите её, прежде чем настраивать другие параметры.');
        // eslint-disable-next-line no-case-declarations
        const channel = message.mentions.channels.first()
          || message.guild.channels.cache.get(args[1])
          || message.channel;

        if (!message.guild.channels.cache.has(channel.id)) return message.fail('Указанного вами канала не существует на данном сервере.');
        if (channel.type !== 'text') return message.fail('Канал данного типа не поддерживается.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'leave.channel': channel.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Канал для уведомлений был успешно установлен на ${channel} (${channel.id})`);
        break;
      case 'message':
        if (!data.leave.enabled) return message.fail('На данном сервере ещё не включена система уведомлений об ушедших участниках. Включите её, прежде чем настраивать другие параметры.');
        // eslint-disable-next-line no-case-declarations
        const msg = args.slice(1).join(' ');
        if (!msg) return message.fail('Укажите пожалуйста новое сообщение уведомлений.');
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'leave.text': msg.slice(0, 999),
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Сообщение уведомлений было успешно обновлено.`);
        break;
      case 'reset':
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'leave.channel': null,
            'leave.text': null,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Настройки модуля были успешно сброшены.`);
        break;
      default:
        return message.channel.send(
          new MessageEmbed()
            .setAuthor('Система уведомлений об ушедших участниках', Constants.static.MODULE_GRAY)
            .setColor(data.leave.enabled ? '#a5ff2a' : '#ff3333')
            .setDescription(`На данном сервере **${data.leave.enabled ? 'включен' : 'отключён'}** модуль уведомлений об ушедших участников.`)
            .addField('Сообщение уведомлений', data.leave.text ? `\`\`\`${data.leave.text.slice(0, 999)}\`\`\`` : 'Сообщение уведомлений не установлено.')
            .addField('Настройка модуля', 'Подробную справку по настройке данного модуля вы можете получить на [этой странице](https://docs.flamebot.ru/settings/leaver).')
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp(),
        );
    }
  }
}

module.exports = LeaverCommand;
