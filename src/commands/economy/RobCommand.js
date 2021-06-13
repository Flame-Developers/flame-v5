const moment = require('moment');
const { getHelp, percentage, randomize } = require('../../utils/Functions');
const CooldownManager = require('../../managers/CooldownManager');
const FlameCommand = require('../../structures/FlameCommand');

class RobCommand extends FlameCommand {
  constructor() {
    super('rob', {
      description: 'Попытаться ограбить пользователя.',
      category: 'economy',
      usage: 'rob <Пользователь>',
      examples: [
        'f.rob 422255876624351232',
      ],
      aliases: [],
    });
  }

  async run(message, args) {
    const manager = new CooldownManager(message.client);
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const authorData = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    // eslint-disable-next-line max-len
    const cooldown = await manager.find({ guildID: message.guild.id, userID: message.author.id, command: this.name });
    if (cooldown) {
      return message.fail(`Данная команда использует задержку, попробуйте снова через **${moment(cooldown.ends).fromNow()}**`);
    }
    if (authorData.money < 500) return message.fail(`Вы должны иметь как минимум **500**${guild.currency} для совершения данной операции.`);

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return getHelp(message, this.name);
    if (user.id === message.author.id) return message.fail('Вы не можете ограбить самого себя.');

    const userData = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });
    if (!userData) return message.fail('Указанный вами пользователь не был найден в базе данного сервера.');
    if (message.client.cache.rob.find((r) => r.guild === message.guild.id && r.user === user.id)) return message.fail('Данного пользователя уже грабили недавно. Попробуйте снова через некоторое время.');

    let amount;
    if (Math.random() < 0.65) {
      amount = percentage(randomize(10, 25), userData.money);
      if (amount === 0) {
        return message.channel.send(`Вы попытались ограбить пользователя **${user.user.tag}**. У вас это вышло, но подвох оказался в том, что он не имел денег на руках. Вы ничего не заработали.`);
      }
      message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно смогли ограбить и отнять у пользователя **${user.user.tag}** **${amount}**${guild.currency}.`);

      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { money: amount } });
      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: user.id}, { $inc: { money: -amount } });
    } else {
      amount = percentage(15, authorData.money);
      message.channel.send(`Вы попытались ограбить пользователя **${user.user.tag}**, но вас поймала полиция. В качестве штрафа вы отдали **${amount}**${guild.currency}.`);

      message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
        $inc: {
          money: -amount,
        },
      });
    }
    message.client.cache.rob.push(
      { guild: message.guild.id, user: user.id },
    );
    setTimeout(() => {
      message.client.cache.rob.splice(
        // eslint-disable-next-line max-len
        message.client.cache.rob.findIndex((r) => r.guild === message.guild.id && r.user === message.author.id),
        1,
      );
    }, 1000 * 60 * 25);

    return manager.handle(
      {
        guildID: message.guild.id,
        userID: message.author.id,
        command: this.name,
        ends: Date.now() + guild.cooldown[this.name] * 1000,
      },
    );
  }
}

module.exports = RobCommand;
