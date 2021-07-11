const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class AddItemCommand extends FlameCommand {
  constructor() {
    super('add-item', {
      description: 'Добавить предмет в магазин сервера.',
      category: 'economy',
      usage: 'add-item <Роль> <Цена> <Описание>',
      aliases: [],
      examples: [
        'f.add-item 817726510379040799 100 Роль крутых ребят',
      ],
      userPermissions: ['MANAGE_ROLES'],
    });
  }

  async run(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });

    if (!role) return getHelp(message, this.name);
    if (role.position > message.guild.me.roles.highest.position) return message.fail('Я не могу выдавать данную роль, поскольку она находится выше моей на сервере.');

    const price = args[1];
    if (!price) return getHelp(message, this.name);
    // eslint-disable-next-line no-restricted-globals,radix
    if (isNaN(price) || !parseInt(price)) return message.fail('Укажите пожалуйста **верную** стоимость предмета.');
    // eslint-disable-next-line radix
    if (parseInt(price) < 1 || parseInt(price) > 10000000) return message.fail(`Стоимость предмета должна быть от **1** до **10,000,000**${data.currency}.`);

    if (data.items?.find((item) => item.roleId === role.id)) return message.fail('Указанная вами роль уже существует в магазине данного сервера.');
    const hasPremium = message.guild.cache.premium;
    // eslint-disable-next-line
    if (!hasPremium && data.items?.length >= 25 || hasPremium && data.items?.length >= 45) return message.fail(`Вы достигли лимита предметов в магазине. ${!hasPremium ? 'Приобретите Flame+ для повышенных лимитов на этом сервере.' : ''}`);

    message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
      $push: {
        items: {
          roleId: role.id,
          // eslint-disable-next-line radix
          cost: parseInt(price),
          description: args.slice(2).length ? args.slice(2).join(' ').slice(0, 350) : null,
        },
      },
    });
    message.channel.send(`${message.client.constants.emojis.DONE} Роль **${role.name}** была успешно добавлена в магазин данного сервера.`);
  }
}

module.exports = AddItemCommand;
