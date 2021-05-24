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
      cooldown: 10,
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    let bet = args[0];

    if (!bet) return getHelp(message, this.name);
    if (isNaN(bet) || !parseInt(bet)) return message.reply('Укажите пожалуйста **верную** ставку :no_entry:');
    if (parseInt(bet) < 20 || parseInt(bet) > 100000) return message.reply('Ставка должна быть больше **20** и меньше **100,000** :no_entry:');
    if (data.money < parseInt(bet)) return message.reply('Сумма данной ставки превышает сумму ваших денег на руках :no_entry:');

    let win = true;
    const slots = ['🍇', '🍓', '🍉', '🍎', '🍏', '🍊', '🍍', '🍋', '🍒'];
    // eslint-disable-next-line max-len
    const fillSlots = (length) => Array(length).fill().map(() => slots[Math.floor(Math.random() * slots.length)]);
    const buildDescription = (values) => [
      'Если вам выпало двое одинаковых эмодзи - ставка удваивается.',
      'Если же все слоты одинаковые, ставка умножается на три.',
      `\n\`\`\`\n${values.join(' | ')}\n\`\`\``,
    ].join(' ');
    let values = fillSlots(3);

    const msg = await message.channel.send(
      new MessageEmbed()
        .setTitle('Слоты')
        .setColor('ffa500')
        .setDescription(buildDescription(values))
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
    // eslint-disable-next-line
    for (let i = 0; i < 3; i++) {
      values = fillSlots(3);
      // eslint-disable-next-line
      await msg.edit(msg?.embeds?.[0].setDescription(buildDescription(values)));
    }

    if (!values.find((a) => a !== values[0])) bet *= 4;
    // eslint-disable-next-line eqeqeq,max-len
    else if (values.findIndex((a, i) => values.findIndex((b, o) => b === a && i !== o) !== -1) !== -1) bet *= 2;
    else win = false;

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: {
        money: win ? bet : -bet,
      },
    });
    message.reply(win ? `:tada: Поздравляем, вы выиграли **${bet}**${guild.currency}.` : `К сожалению, в этот раз вы проиграли. У вас было отнято **${bet}**${guild.currency}.`);
  }
}

module.exports = SlotsCommand;
