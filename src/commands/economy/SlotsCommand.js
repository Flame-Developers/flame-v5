/* eslint-disable no-restricted-globals,radix */
const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class SlotsCommand extends FlameCommand {
  constructor() {
    super('slots', {
      description: 'Испытать удачу в слотах.',
      category: 'economy',
      usage: 'slots <Ставка>',
      aliases: [],
      premium: true,
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    let bet = args[0];

    if (!bet) return getHelp(message, this.name);
    if (isNaN(bet) || !parseInt(bet)) return message.fail('Укажите пожалуйста **верную** ставку.');
    if (parseInt(bet) < 20 || parseInt(bet) > 100000) return message.fail('Ставка должна быть больше **20** и меньше **100,000**.');
    if (data.money < parseInt(bet)) return message.fail('Сумма данной ставки превышает сумму ваших денег на руках.');

    let win = true;
    const slots = ['🍇', '🍓', '💸', '🍎', '💰', '🍊', '🍍', '🍋', '🍒'];
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

    const values = Array(3).fill().map(() => slots[Math.floor(Math.random() * slots.length)]);
    const msg = await message.channel.send(new MessageEmbed().setColor('ffa500').setTitle('Прокручиваем слоты...'));

    await sleep(1000);
    if (!values.find((a) => a !== values[0])) bet *= 4;
    // eslint-disable-next-line eqeqeq,max-len
    else if (values.findIndex((a, i) => values.findIndex((b, o) => b === a && i !== o) !== -1) !== -1) bet *= 2;
    else win = false;

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: {
        money: win ? bet : -bet,
      },
    });
    msg.edit(
      new MessageEmbed()
        .setTitle(win ? `🎉 Поздравляем, вы выиграли **${bet}**${guild.currency}.` : `К сожалению, в этот раз вы проиграли. У вас было отнято **${bet}**${guild.currency}.`)
        .setColor('ffa500')
        .setDescription(`>>> Если вам выпало двое одинаковых эмодзи - ставка удваивается. Если же все слоты одинаковые, ставка умножается на три.\`\`\`\n${values.join(' | ')}\n\`\`\``)
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
  }
}

module.exports = SlotsCommand;
