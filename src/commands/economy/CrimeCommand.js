const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { randomize, percentage } = require('../../utils/Functions');
const CooldownManager = require('../../managers/CooldownManager');

class CrimeCommand extends FlameCommand {
  constructor() {
    super('crime', {
      description: 'Попытаться совершить преступление.',
      category: 'economy',
      usage: 'crime',
      aliases: [],
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
    const user = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    const transport = guild.transport?.find((t) => t.requiredFor === this.name);
    if (transport && !user.ownedTransport?.includes(transport.key)) return message.fail(`Для выполнения данного действия вам необходимо иметь транспорт "**${transport.name}**".`);
    if (user?.money < 500) return message.fail(`Для использования данной команды вы должны иметь как минимум **500**${guild.currency} на руках.`);
    let amount;

    if (Math.random() < 0.5) {
      amount = randomize(100, 500);
      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
        $inc: {
          money: amount,
        },
      });
      await message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
          .setColor('ffa500')
          .setTitle(`Вы успешно совершили преступление, а также заработали **${amount}**${guild.currency}`)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp(),
      );
    } else {
      amount = percentage(randomize(10, 30), user.money);
      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
        $inc: {
          money: -amount,
        },
      });
      await message.channel.send(
        new MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
          .setColor('ff3333')
          .setTitle(`Вы не смогли закончить свою миссию, потому что вас поймала полиция. Вы откупились от срока штрафом в **${amount}**${guild.currency}`)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp(),
      );
    }
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

module.exports = CrimeCommand;
