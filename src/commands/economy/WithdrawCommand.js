const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class WithdrawCommand extends FlameCommand {
  constructor() {
    super('withdraw', {
      description: 'Снятие определенной суммы с банковского счёта.',
      category: 'economy',
      usage: 'withdraw <all/Сумма>',
      aliases: ['with'],
      examples: [
        'f.withdraw 300',
        'f.withdraw',
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
      value = parseInt(data.bank);
      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
        $inc: {
          money: value,
          bank: -value,
        },
      });
    } else {
      if (isNaN(value) || !parseInt(value)) return message.fail('Укажите пожалуйста **верную** сумму вывода.');
      if (parseInt(value) <= 0) return message.fail('Сумма вывода не может быть меньше **1**.');
      if (data.bank < parseInt(value)) return message.fail('Вы не можете совершить данный вывод, так как не имеете столь крупной суммы на банковском счету.');

      message.client.database.collection('guildusers').updateOne({
        guildID: message.guild.id,
        userID: message.author.id,
      }, {
        $inc: {
          money: parseInt(value),
          bank: -parseInt(value),
        },
      });
    }

    message.channel.send(`${message.client.constants.emojis.DONE} Вывод размером в **${value}**${guild.currency} прошел успешно. Отныне деньги у вас на руках.`);
  }
}

module.exports = WithdrawCommand;
