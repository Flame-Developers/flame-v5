const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class DepositCommand extends FlameCommand {
  constructor() {
    super('deposit', {
      description: 'Депозит определенной суммы на банковский счёт.',
      category: 'economy',
      usage: 'deposit <all/Сумма>',
      aliases: ['dep'],
      examples: [
        'f.deposit 250',
        'f.deposit all',
      ],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({
      guildID: message.guild.id,
      userID: message.author.id,
    });

    let value = args[0];
    if (!value) return getHelp(message, this.name);

    if (value === 'all') {
      value = parseInt(data.money);
      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
        $inc: {
          money: -value,
          bank: value,
        },
      });
    } else {
      if (isNaN(value) || !parseInt(value)) return message.fail('Укажите пожалуйста **верную** сумму депозита.');
      if (parseInt(value) <= 0) return message.fail('Сумма депозита не может быть меньше **1**.');
      if (data.money < parseInt(value)) return message.fail('Вы не можете совершить данный депозит, так как не имеете столь крупной суммы на руках.');

      message.client.database.collection('guildusers').updateOne({
        guildID: message.guild.id,
        userID: message.author.id,
      }, {
        $inc: {
          money: -parseInt(value),
          bank: parseInt(value),
        },
      });
    }

    message.channel.send(`${message.client.constants.emojis.DONE} Депозит размером в **${value}**${guild.currency} прошел успешно. Отныне деньги находятся в вашем банке.`);
  }
}

module.exports = DepositCommand;
