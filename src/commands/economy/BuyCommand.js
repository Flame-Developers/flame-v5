const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class BuyCommand extends FlameCommand {
  constructor() {
    super('buy', {
      description: 'Купить определенный товар в магазине.',
      category: 'economy',
      usage: 'buy <Роль/ID>',
      aliases: [],
      examples: [
        'f.buy 805446895622291467',
      ],
      clientPermissions: ['MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

    if (!role) return getHelp(message, this.name);
    const item = guild.items?.find((r) => r.roleId === role.id);

    if (!item) return message.fail('Указанный вами предмет не был найден в магазине данного сервера.');
    if (message.guild.me.roles.highest.position <= role.position) return message.fail('Я не могу выдавать данную роль, поскольку она находится выше моей на сервере.');
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    if (item.cost > data.money) return message.fail('У вас недостаточно денег для покупки данного предмета.');
    if (message.guild.me.roles.highest.position <= message.member.roles.highest.position) return message.fail('Я не могу выдать вам данную роль, поскольку ваша роль находится выше моей на сервере.');
    if (message.member.roles.cache.has(role.id)) return message.fail('У вас уже имеется эта роль.');

    await message.member.roles.add(role.id);
    message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
      $inc: {
        money: -parseInt(item.cost),
      },
    });
    message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно приобрели роль **${role.name}** за **${item.cost}**${guild.currency}.`);
  }
}

module.exports = BuyCommand;
