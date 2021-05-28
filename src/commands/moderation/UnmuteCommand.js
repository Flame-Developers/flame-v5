const FlameCommand = require('../../structures/FlameCommand');
const MuteManager = require('../../managers/MuteManager');
const { getHelp } = require('../../utils/Functions');

class UnmuteCommand extends FlameCommand {
  constructor() {
    super('unmute', {
      description: 'Снять с определённого пользователя мьют.',
      category: 'moderation',
      usage: 'unmute <Пользователь>',
      aliases: [],
      clientPermissions: ['MANAGE_ROLES'],
      userPermissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const mutes = new MuteManager(message.client);
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    const data = await message.client.database.collection('mutes').findOne({ guildID: message.guild.id, userID: user.id });

    if (!data) return message.fail('Указанный вами пользователь не замьючен на данном сервере.');
    if (user.roles.cache.has(data?.muteRole) && user.roles.highest.position > message.guild.me.roles.highest.position) return message.fail('Я не могу управлять ролями данного пользователя, потому что его роль находится выше моей.');

    user.roles.remove(data?.muteRole).catch(null);
    mutes.delete({ guildID: message.guild.id, userID: user.id });

    return message.reply(`${message.client.constants.emojis.DONE} Пользователь **${user.user.tag}** (${user.id}) был успешно размьючен.`);
  }
}

module.exports = UnmuteCommand;
