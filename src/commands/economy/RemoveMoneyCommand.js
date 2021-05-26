const { getHelp } = require('../../utils/Functions');
const StringParserUtil = require('../../utils/StringParserUtil');
const FlameCommand = require('../../structures/FlameCommand');

class RemoveMoneyCommand extends FlameCommand {
  constructor() {
    super('remove-money', {
      description: 'Забрать у пользователя определенную сумму денег.',
      category: 'economy',
      usage: 'remove-money <@Пользователь/ID> <Сумма> [--bank]',
      aliases: [],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return getHelp(message, this.name);

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });

    if (!data) return message.reply('Указанный вами пользователь не был найден в базе данного сервера :no_entry:');

    const value = args[1];
    if (!value || isNaN(value) || !parseInt(value)) return getHelp(message, this.name);
    if (parseInt(value) < 1 || parseInt(value) > 1000000) return message.reply('Сумма денег не должна быть меньше нуля и больше **1,000,000** :no_entry:');

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: user.id }, {
      $inc: {
        [StringParserUtil.parseFlags(args.slice(2).join(' '))?.includes('--bank') ? 'bank' : 'money']: -parseInt(value),
      },
    });
    message.channel.send(`✅ У пользователя **${user.user.tag}** (${user.user.id}) было успешно отнято **${value}**${guild.currency}.`);
  }
}

module.exports = RemoveMoneyCommand;
