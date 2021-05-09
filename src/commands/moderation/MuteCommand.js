const ms = require('ms');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');
const MuteManager = require('../../managers/MuteManager');

class MuteCommand extends FlameCommand {
  constructor() {
    super('mute', {
      description: 'Замьютить пользователя на сервере.',
      category: 'moderation',
      usage: 'mute <Пользователь> [Причина]',
      aliases: [],
      userPermissions: ['MANAGE_ROLES', 'MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const Mutes = new MuteManager(message.client);

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const time = args[1];

    if (!user) return getHelp(message, this.name);
    if (user.permissions.has('MANAGE_ROLES') || user.roles.highest.position > message.member.roles.highest.position) return message.reply('Вы не можете замьютить данного пользователя, потому что у него имеется роль выше вашей/он имеет равные вам права :no_entry:');

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });

    if (!guild.muteRole || !message.guild.roles.cache.has(guild?.muteRole)) return message.reply(`Похоже, на этом сервере не установлена роль мьюта. Установите её при помощи команды \`${guild.prefix}muterole set\`, прежде чем использовать данную команду :no_entry:`);
    if (await Mutes.find({ guildID: message.guild.id, userID: user?.id }) && user.roles.cache.has(guild.muteRole)) return message.reply('Указанный вами пользователь уже замьючен на данном сервере :no_entry:');

    if (!time) return getHelp(message, this.name);
    if (!ms(time) || ms(time) > ms('14d') || ms(time) < ms('1m')) return message.reply('Укажите пожалуйста **корректное** время мьюта (от одной минуты до 14 дней) :no_entry:');

    const mute = {
      guildID: message.guild.id,
      userID: user.id,
      muteRole: guild.muteRole,
      ends: Date.now() + ms(time),
      details: {
        tag: user.user.tag,
        moderator: message.author.id,
        reason: args.slice(2).join(' ') || 'Причина не установлена.',
      },
    };
    Mutes.create(mute);

    user.roles.add(guild.muteRole).catch(console.error);
    message.reply(`✅ Пользователь **${user.user.tag}** (${user.id}) был успешно замьючен модератором **${message.author.tag}**.`);

    return Mutes.handle(mute);
  }
}

module.exports = MuteCommand;
