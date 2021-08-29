const { MessageEmbed } = require('discord.js');
const { randomize } = require('../../utils/Functions');
const CooldownManager = require('../../managers/CooldownManager');
const FlameCommand = require('../../structures/FlameCommand');

class MineCommand extends FlameCommand {
  constructor() {
    super('mine', {
      description: 'Пойти в шахту и добыть ресурсов.',
      category: 'economy',
      usage: 'mine [Кирка]',
      aliases: [],
      examples: [
        'f.mine wood',
        'f.mine',
      ],
    });
  }

  async run(message, args) {
    const manager = new CooldownManager(message.client);
    const cooldown = await manager
      .find({ guildID: message.guild.id, userID: message.author.id, command: this.name });

    if (cooldown) {
      const expirationTimestamp = (cooldown?.ends / 1000).toFixed(0);
      return message.fail(`Данная команда использует задержку, возвращайтесь снова примерно <t:${expirationTimestamp}:R> (<t:${expirationTimestamp}>).`);
    }

    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    const transport = guild.transport?.find((t) => t.requiredFor === this.name);
    if (transport && !data.ownedTransport?.includes(transport.key)) return message.fail(`Для выполнения данного действия вам необходимо иметь транспорт "**${transport.name}**".`);
    if (!data.ownedPickaxes?.length) return message.fail('Похоже, пока что вы не имеете ни одной доступной кирки.');

    let pickaxe = args[0];
    if (pickaxe) {
      if (!guild.pickaxes.find((p) => p.key === pickaxe)) return message.fail('Указанная вами кирка не была найдена на этом сервере.');
      if (!data.ownedPickaxes.includes(pickaxe)) return message.fail('Вы не имеете данной кирки.');
    } else pickaxe = data.ownedPickaxes[Math.floor(Math.random() * data.ownedPickaxes.length)];

    pickaxe = guild.pickaxes.find((p) => p.key === pickaxe);
    const money = randomize(pickaxe.income, pickaxe.income * randomize(1.5, 2));

    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: {
        money: parseInt(money),
      },
    });
    message.channel.send(
      new MessageEmbed()
        .setTitle('Добыча ресурсов!')
        .setDescription(`Поход в шахту прошел успешно, была использована **${pickaxe.name}** кирка.\nВозвращайтесь снова через некоторое время!`)
        .addField('Полученные ресурсы:', `Валюта сервера: +**${money}**${guild.currency}`)
        .setColor('ffa500'),
    );

    return manager.create(
      {
        guildID: message.guild.id,
        userID: message.author.id,
        command: this.name,
        ends: Date.now() + guild.cooldown[this.name] * 1000,
      },
    );
  }
}

module.exports = MineCommand;
