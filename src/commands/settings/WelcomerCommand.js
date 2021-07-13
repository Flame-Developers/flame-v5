const { MessageEmbed } = require('discord.js');
const Constants = require('../../utils/Constants');
const FlameCommand = require('../../structures/FlameCommand');

class WelcomerCommand extends FlameCommand {
  constructor() {
    super('welcomer', {
      description: 'Управление модулем приветствия участников.',
      category: 'settings',
      aliases: [],
      usage: 'welcomer [toggle/channel/message]',
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
            'welcome.enabled': !data.welcome.enabled,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Система приветствий была успешно **${data.welcome.enabled ? 'отключена' : 'включена'}** на данном сервере.`);
        break;
      case 'role':
        // eslint-disable-next-line no-case-declarations
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

        if (!role) return message.fail('Пожалуйста укажите роль для новых пользователей.');
        if (!message.guild.roles.cache.has(role.id)) return message.fail('Указанной роли не существует на данном сервере.');
        if (message.guild.me.roles.highest.position < role.position) return message.fail('Я не смогу выдавать данную роль, так как она находится выше моей на данном сервере.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            welcomeRole: role.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль для новых пользователей была успешно установлена на ${role}.`);
        break;
      case 'channel':
        if (!data.welcome.enabled) return message.fail('На данном сервере ещё не включена система приветствий. Включите её, прежде чем настраивать другие параметры .');
        // eslint-disable-next-line no-case-declarations
        const channel = message.mentions.channels.first()
                        || message.guild.channels.cache.get(args[1])
                        || message.channel;

        if (!message.guild.channels.cache.has(channel.id)) return message.fail('Указанного вами канала не существует на данном сервере.');
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'welcome.channel': channel.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Канал для приветствий был успешно установлен на ${channel} (${channel.id})`);
        break;
      case 'message':
        if (!data.welcome.enabled) return message.fail('На данном сервере ещё не включена система приветствий. Включите её, прежде чем настраивать другие параметры.');
        // eslint-disable-next-line no-case-declarations
        const msg = args.slice(1).join(' ');
        if (!msg) return message.fail('Укажите пожалуйста новое сообщение приветствия.');
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'welcome.text': msg.slice(0, 999),
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Сообщение приветствия было успешно обновлено.`);
        break;
      case 'reset':
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'welcome.channel': null,
            'welcome.text': null,
            welcomeRole: null,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Настройки модуля были успешно сброшены.`);
        break;
      default:
        return message.channel.send(
          new MessageEmbed()
            .setAuthor('Система приветствий новых участников', Constants.static.MODULE_GRAY)
            .setColor(data.welcome.enabled ? '#a5ff2a' : '#ff3333')
            .setDescription(`На данном сервере **${data.welcome.enabled ? 'включен' : 'отключён'}** модуль приветствий новых участников.`)
            .addField('Сообщение приветствия', data.welcome.text ? `\`\`\`${data.welcome.text.slice(0, 999)}\`\`\`` : 'Сообщение приветствия не установлено.', true)
            .addField('Роль для новых пользователей', data.welcomeRole ? `<@&${data.welcomeRole}> (${data.welcomeRole})` : 'Роль для новых пользователей не установлена.', true)
            .addField('Настройка модуля', 'Подробную справку по настройке данного модуля вы можете получить на [этой странице](https://docs.flamebot.ru/abilities/welcomer).')
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp(),
        );
    }
  }
}

module.exports = WelcomerCommand;
