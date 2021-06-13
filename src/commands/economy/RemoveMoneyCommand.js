const { getHelp } = require('../../utils/Functions');
const StringParserUtil = require('../../utils/misc/StringParserUtil');
const FlameCommand = require('../../structures/FlameCommand');

class RemoveMoneyCommand extends FlameCommand {
  constructor() {
    super('remove-money', {
      description: 'Забрать у пользователя определенную сумму денег.',
      category: 'economy',
      usage: 'remove-money <@Пользователь/ID> <Сумма> [--bank]',
      aliases: [],
      examples: [
        'f.remove-money @TheFerryn#0001 100 --bank',
      ],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return getHelp(message, this.name);

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });

    if (!data) return message.fail('Указанный вами пользователь не был найден в базе данного сервера.');

    const value = args[1];
    if (!value || isNaN(value) || !parseInt(value)) return getHelp(message, this.name);
    if (parseInt(value) < 1 || parseInt(value) > 1000000) return message.fail('Сумма денег не должна быть меньше нуля и больше **1,000,000**.');

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: user.id }, {
      $inc: {
        [StringParserUtil.parseFlags(args.slice(2).join(' '))?.includes('--bank') ? 'bank' : 'money']: -parseInt(value),
      },
    });
    message.channel.send(`${message.client.constants.emojis.DONE} У пользователя **${user.user.tag}** (${user.user.id}) было успешно отнято **${value}**${guild.currency}.`);
  }
}

module.exports = RemoveMoneyCommand;
