const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class RodCommand extends FlameCommand {
  constructor() {
    super('rod', {
      description: 'Управление удочками для рыбалки.',
      category: 'economy',
      usage: 'rod <add/remove/list/buy>',
      aliases: [],
      examples: [
        'f.rod add Деревянная wood 1000 200',
        'f.rod buy wood',
        'f.rod remove wood',
      ],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    const option = args[0];

    switch (option) {
      case 'list':
        message.channel.send(
          new MessageEmbed()
            .setAuthor('Список доступных к покупке удочек', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Twemoji_1f41f.svg/1024px-Twemoji_1f41f.svg.png')
            .setColor('ffa500')
            .setDescription(
              guild.rods?.length
                ? guild.rods.map((x) => `**${x.name} удочка** (\`${x.key}\`) | ${x.price}${guild.currency} | ${data.ownedRods?.includes(x.key) ? '🔓' : '🔒'}`)
                : 'Список удочек данного сервера пуст. Свяжитесь с администратором сервера, если считаете, что так быть не должно.',
            )
            .addField('Подсказка', `Чем дороже удочка — тем больше прибыли она будет приносить. Купить удочку можно командой \`${guild.prefix}rod buy\`.`),
        );
        break;
      case 'add':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');
        const hasPremium = message.guild.cache.premium;
        // eslint-disable-next-line no-mixed-operators
        if (!hasPremium && guild.rods?.length >= 5 || hasPremium && guild.rods?.length >= 10) return message.fail(`Вы достигли лимита удочек на этом сервере. ${!hasPremium ? 'Приобретите Flame+ для повышенных лимитов.' : ''}`);

        // eslint-disable-next-line no-unused-vars
        const [_, name, key, price, income] = args;

        if (!name) return message.fail('Укажите пожалуйста название удочки.');
        if (name.length >= 20) return message.fail('Название удочки не должно превышать лимит в **20** символов.');

        if (!key) return message.fail('Укажите пожалуйста идентификатор удочки.');
        if (key.length >= 10) return message.fail('Идентификатор удочки не должен превышать лимит в **10** символов.');
        if (guild.rods?.find((p) => p.key === key)) return message.fail('На этом сервере уже имеется удочка с таким идентификатором.');

        if (!price || isNaN(price) || !parseInt(price)) return message.fail('Укажите пожалуйста стоимость данной удочки.');
        if (parseInt(price) < 1 || parseInt(price) > 5000000) return message.fail('Стоимость удочки не должна быть меньше **1** и больше **5,000,000**.');

        if (!income || isNaN(income) || !parseInt(income)) return message.fail('Укажите пожалуйста минимальный доход с удочки.');
        if (parseInt(income) < 1 || parseInt(income) > 2000000) return message.fail('Минимальный доход не должен быть меньше **1** и больше **2,000,000**.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $push: {
            rods: {
              name,
              key,
              price,
              income,
            },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} **${name}** удочка с идентификатором **${key}** стоимостью в **${price}**${guild.currency} была успешно добавлена на рынок.`);
        break;
      case 'remove':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');

        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор удочки, которую вы хотите удалить');
        if (!guild.rods?.find((p) => p.key === args[1])) return message.fail('Удочки с указанным вами идентификатором не существует на рынке данного сервера.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $pull: {
            rods: { key: args[1] },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Удочка с идентификатором **${args[1]}** была успешно удалена.`);
        break;
      case 'buy':
        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор удочки, которую вы хотите купить.');
        const rod = guild.rods?.find((p) => p.key === args[1]);

        if (!rod) return message.fail('Указанная вами удочка не была найдена на рынке данного сервера.');
        if (rod.price > data.money) return message.fail('У вас недостаточно средств для покупки данной удочки.');
        if (data.ownedRods?.includes(rod.key)) return message.fail('У вас уже имеется эта удочка.');

        message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
          $inc: { money: -parseInt(rod.price) },
          $push: { ownedRods: rod.key },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно приобрели данную удочку за **${rod.price}**${guild.currency}. С нее вы будете получать от **${rod.income}** до ~**${rod.income * 2}**${guild.currency} за один раз.`);
        break;
      default:
        getHelp(message, this.name);
    }
  }
}

module.exports = RodCommand;
