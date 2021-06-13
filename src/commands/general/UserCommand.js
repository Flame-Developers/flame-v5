const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class UserCommand extends FlameCommand {
  constructor() {
    super('user', {
      description: 'Показывает информацию о пользователе.',
      category: 'general',
      usage: 'user [@Пользователь/ID]',
      cooldown: 3,
      aliases: ['userinfo', 'user-info'],
      examples: [
        'f.user 553557567591284737',
        'f.user @TheFerryn#0001',
      ],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first()
                     || message.guild.members.cache.get(args[0])
                     || message.member;

    const flags = {
      HOUSE_BRILLIANCE: '<:brilliance:814073154296217641>',
      HOUSE_BALANCE: '<:balance:814073199494168588>',
      HOUSE_BRAVERY: '<:bravery:814073175377051668>',
      HYPESQUAD_EVENTS: '<:hypesquad_events:814073426889277440>',
      BUGHUNTER_LEVEL_1: '<:bughunter:814073221220925441>',
      BUGHUNTER_LEVEL_2: '<:bughunter2:814072532030324746>',
      EARLY_VERIFIED_BOT_DEVELOPER: '<:developer:814072505336987678>',
      EARLY_SUPPORTER: '<:supporter:814073354414981170>',
      PARTNERED_SERVER_OWNER: '<:partnernew:814073246026563614>',
      DISCORD_EMPLOYEE: '<:stafftools:814073316038017066>',
    };

    const statuses = {
      online: '<:online2:814075431758069790> В сети',
      offline: '<:offline2:814075554856304660> Не в сети',
      dnd: '<:dnd2:814075464078983229> Не беспокоить',
      idle: '<:idle:814075524829282374> Не активен',
    };

    let stat = '';
    if (user.user.presence.clientStatus) {
      if (user.user.presence.clientStatus.web) stat = 'Браузер';
      else if (user.user.presence.clientStatus.mobile) stat = 'Телефон';
      else if (user.user.presence.clientStatus.desktop) stat = 'Компьютер';
    }
    const embed = new MessageEmbed()
      .setTitle(user.nickname ? `${user.user.tag} | ${user.nickname}` : user.user.tag)
      .setURL(user.user.avatarURL({ dynamic: true }))
      .setColor(user.roles.highest.color ? user.roles.highest.color.toString(16) : 'FFA500')
      .setImage(user.user.displayAvatarURL({ size: 2048, dynamic: true }))
      .setDescription(
        `Значки пользователя: ${user.user.flags?.toArray().map((r) => flags[r]).join('  ') || '**Отсутствуют**'}\nСтатус: **${statuses[user.user.presence.status]}**\nУстройство: **${stat || 'Неизвестно'}**`,
      )
      .addField('Зарегистрирован', new Date(user.user.createdAt).toISOString().replace('T', ' ').substr(0, 19))
      .addField('Присоединился', new Date(user.joinedAt).toISOString().replace('T', ' ').substr(0, 19))
      .setFooter(`ID: ${user.id}`, message.guild.iconURL())
      .setTimestamp();

    return message.reply(embed);
  }
}

module.exports = UserCommand;
