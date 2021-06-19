const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { randomize } = require('../../utils/Functions');
const CooldownManager = require('../../managers/CooldownManager');
const FlameCommand = require('../../structures/FlameCommand');

class FishCommand extends FlameCommand {
  constructor() {
    super('fish', {
      description: 'Сходить на рыбалку.',
      category: 'economy',
      usage: 'fish [Удочка]',
      aliases: [],
      examples: [],
    });
  }

  async run(message, args) {
    const manager = new CooldownManager(message.client);
    // eslint-disable-next-line max-len
    const cooldown = await manager.find({ guildID: message.guild.id, userID: message.author.id, command: this.name });
    if (cooldown) {
      return message.fail(`Данная команда использует задержку, попробуйте снова через **${moment(cooldown.ends).fromNow()}**`);
    }

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    const transport = guild.transport?.find((t) => t.requiredFor === this.name);
    if (transport && !data.ownedTransport?.includes(transport.key)) return message.fail(`Для выполнения данного действия вам необходимо иметь транспорт "**${transport.name}**".`);
    if (!data.ownedRods?.length) return message.fail('Похоже, пока что вы не имеете ни одной доступной удочки.');

    let rod = args[0];
    if (rod) {
      if (!guild.rods.find((r) => r.key === rod)) return message.fail('Указанная вами удочка не была найдена на этом сервере.');
      if (!data.ownedRods.includes(rod)) return message.fail('Вы не имеете данной удочки.');
    } else rod = data.ownedRods[Math.floor(Math.random() * data.ownedRods.length)];

    rod = guild.rods.find((r) => r.key === rod);
    const money = randomize(rod.income, rod.income * randomize(1.5, 2));

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: {
        // eslint-disable-next-line radix
        money: parseInt(money),
      },
    });
    message.channel.send(
      new MessageEmbed()
        .setTitle('Рыбалка!')
        .setDescription(`Рыбалка прошла успешно, была использована **${rod.name}** удочка.\nВозвращайтесь снова через некоторое время!`)
        .addField('Полученные ресурсы:', `Валюта сервера: +**${money}**${guild.currency}`)
        .setColor('ffa500'),
    );
    // eslint-disable-next-line no-return-await
    return await manager.handle(
      {
        guildID: message.guild.id,
        userID: message.author.id,
        command: this.name,
        ends: Date.now() + guild.cooldown[this.name] * 1000,
      },
    );
  }
}

module.exports = FishCommand;
