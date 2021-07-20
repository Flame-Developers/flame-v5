const ms = require('ms');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');
const MuteManager = require('../../managers/MuteManager');

class MuteCommand extends FlameCommand {
  constructor() {
    super('mute', {
      description: 'Замьютить пользователя на сервере.',
      category: 'moderation',
      usage: 'mute <Пользователь> <Время> [Причина]',
      aliases: [],
      userPermissions: ['MANAGE_ROLES', 'MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const manager = new MuteManager(message.client);

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const time = args[1];

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('MANAGE_ROLES') || user.roles.highest.position > message.member.roles.highest.position) return message.fail('Вы не можете замьютить данного пользователя, потому что у него имеется роль выше вашей/он имеет равные вам права.');

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });

    if (!guild.muteRole || !message.guild.roles.cache.has(guild?.muteRole)) return message.fail(`Похоже, на этом сервере не установлена роль мьюта. Установите её при помощи команды \`${guild.prefix}muterole set\`, прежде чем использовать данную команду.`);
    if (await manager.find({ guildID: message.guild.id, userID: user?.id }) && user.roles.cache.has(guild.muteRole)) return message.fail('Указанный вами пользователь уже замьючен на данном сервере.');

    if (!time) return getHelp(message, this.name);
    if (!ms(time) || ms(time) > ms('14d') || ms(time) < ms('1m')) return message.fail('Укажите пожалуйста **корректное** время мьюта (от одной минуты до 14 дней).');

    user.roles.add(guild.muteRole).catch(console.error);
    message.reply(`${message.client.constants.emojis.DONE} Пользователь **${user.user.tag}** (${user.id}) был успешно замьючен модератором **${message.author.tag}**.`);

    manager.create(
      {
        guildID: message.guild.id,
        userID: user.id,
        muteRole: guild.muteRole,
        ends: Date.now() + ms(time),
        details: {
          tag: user.user.tag,
          moderator: message.author.id,
          reason: args.slice(2).join(' ') || 'Причина не установлена.',
        },
      },
    );
  }
}

module.exports = MuteCommand;
