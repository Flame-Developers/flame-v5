const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const Constants = require('../../utils/Constants');

class AntiInviteCommand extends FlameCommand {
  constructor() {
    super('anti-invite', {
      description: 'Настройки модуля защиты от сторонних приглашений.',
      category: 'settings',
      usage: 'anti-invite [toggle/message/whitelist/reset]',
      aliases: ['antiinvite'],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'toggle':
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'antiInvite.enabled': !data.antiInvite.enabled,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Защита от приглашений была успешно **${data.antiInvite.enabled ? 'отключена' : 'включена'}** на данном сервере.`);
        break;
      case 'message':
        if (!data.antiInvite.enabled) return message.fail('На данном сервере ещё не включена защита от приглашений. Включите её прежде чем настраивать другие параметры.');
        // eslint-disable-next-line
        const msg = args.slice(1).join(' ');
        if (!msg) return message.fail('Укажите пожалуйста новое сообщение.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'antiInvite.message': msg.slice(0, 999),
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Сообщение было успешно отредактировано.`);
        break;
      case 'reset':
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'antiInvite.message': null,
            'antiInvite.whitelist': [],
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Настройки модуля были успешно сброшены.`);
        break;
      case 'whitelist':
        // eslint-disable-next-line
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

        if (!role) return message.fail('Укажите пожалуйста роль, которая будет добавлена в белый список.');
        if (!message.guild.roles.cache.has(role.id)) return message.fail('Указанной вами роли не существует на данном сервере.');
        if (role.id === message.guild.id) return message.fail('Вы не можете добавить данную роль в белый список.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          [data.antiInvite?.whiteList?.includes(role.id) ? '$pull' : '$push']: {
            'antiInvite.whiteList': role.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Роль **${role.id}** была успешно ${!data.antiInvite?.whiteList?.includes(role.id) ? 'занесена в белый список.' : 'вынесена из белого списка.'}`);
        break;
      default:
        message.channel.send(
          new MessageEmbed()
            .setAuthor('Защита от сторонних приглашений', Constants.static.MODULE_GRAY)
            .setColor(data.antiInvite.enabled ? '#a5ff2a' : '#ff3333')
            .setDescription(`На данном сервере **${data.antiInvite.enabled ? 'активирована' : 'не активирована'}** защита от сторонних приглашений.`)
            .addField('Сообщение', data.antiInvite.message ? `\`\`\`${data.antiInvite.message}\`\`\`` : 'Сообщение не установлено.')
            .addField('Настройка модуля', 'Подробную справку по настройке данной системы вы сможете получить на [этой странице](https://docs.flamebot.ru/settings/auto-moderation).')
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp(),
        );
    }
  }
}

module.exports = AntiInviteCommand;
