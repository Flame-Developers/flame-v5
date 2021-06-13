/* eslint-disable radix,no-restricted-globals */
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class PayCommand extends FlameCommand {
  constructor() {
    super('pay', {
      description: 'Перевести определенному пользователю деньги.',
      category: 'economy',
      usage: 'pay <Пользователь> <Сумма>',
      aliases: [],
      examples: [
        'f.pay 422255876624351232 400',
      ],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!user) return getHelp(message, this.name);
    const userData = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });
    const authorData = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    const amount = args[1];

    if (!userData) return message.fail('Указанный вами пользователь не был найден в базе данного сервера.');

    if (!amount) return getHelp(message, this.name);
    if (isNaN(amount) || !parseInt(amount)) return message.fail('Укажите пожалуйста верную сумму платежа.');
    if (parseInt(amount) < 1 || parseInt(amount) > 1000000) return message.fail('Сумма платежа не должна быть меньше **1** и больше **1,000,000**.');
    if (amount > authorData.money) return message.fail('Указанная сумма превышает кол-во ваших денег на руках.');

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: { money: -parseInt(amount) },
    });
    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: user.id }, {
      $inc: { money: parseInt(amount) },
    });

    return message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно перевели **${amount}**${guild.currency} пользователю **${user.user.tag}**.`);
  }
}

module.exports = PayCommand;
