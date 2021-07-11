/* eslint-disable no-case-declarations,no-restricted-globals,radix */
const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class PickaxeCommand extends FlameCommand {
  constructor() {
    super('pickaxe', {
      description: 'Управление кирками для добычи ресурсов.',
      category: 'economy',
      usage: 'pickaxe <add/remove/list/buy>',
      aliases: [],
      examples: [
        'f.pickaxe add Деревянная wood 1000 200',
        'f.pickaxe buy wood',
        'f.pickaxe remove wood',
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
            .setAuthor('Список доступных к покупке кирок', 'https://www.emoji.co.uk/files/apple-emojis/objects-ios/651-pick.png')
            .setColor('ffa500')
            .setDescription(
              guild.pickaxes?.length
                ? guild.pickaxes.map((x) => `**${x.name} кирка** (\`${x.key}\`) | ${x.price}${guild.currency} | ${data.ownedPickaxes?.includes(x.key) ? '🔓' : '🔒'}`)
                : 'Список кирок данного сервера пуст. Свяжитесь с администратором сервера, если считаете, что так быть не должно.',
            )
            .addField('Подсказка', `Чем дороже кирка — тем больше прибыли она будет приносить. Купить кирку можно командой \`${guild.prefix}pickaxe buy\`.`),
        );
        break;
      case 'add':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');
        const hasPremium = message.guild.cache.premium;
        // eslint-disable-next-line no-mixed-operators
        if (!hasPremium && guild.pickaxes?.length >= 5 || hasPremium && guild.pickaxes?.length >= 10) return message.fail(`Вы достигли лимита кирок на этом сервере. ${!hasPremium ? 'Приобретите Flame+ для повышенных лимитов.' : ''}`);

        // eslint-disable-next-line no-unused-vars
        const [_, name, key, price, income] = args;

        if (!name) return message.fail('Укажите пожалуйста название кирки.');
        if (name.length >= 20) return message.fail('Название кирки не должно превышать лимит в **20** символов.');

        if (!key) return message.fail('Укажите пожалуйста идентификатор кирки.');
        if (key.length >= 10) return message.fail('Идентификатор кирки не должен превышать лимит в **10** символов.');
        if (guild.pickaxes?.find((p) => p.key === key)) return message.fail('На этом сервере уже имеется кирка с таким идентификатором.');

        if (!price || isNaN(price) || !parseInt(price)) return message.fail('Укажите пожалуйста стоимость данной кирки.');
        if (parseInt(price) < 1 || parseInt(price) > 5000000) return message.fail('Стоимость кирки не должна быть меньше **1** и больше **5,000,000**.');

        if (!income || isNaN(income) || !parseInt(income)) return message.fail('Укажите пожалуйста минимальный доход с кирки.');
        if (parseInt(income) < 1 || parseInt(income) > 2000000) return message.fail('Минимальный доход не должен быть меньше **1** и больше **2,000,000**.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $push: {
            pickaxes: {
              name,
              key,
              price,
              income,
            },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} **${name}** кирка с идентификатором **${key}** стоимостью в **${price}**${guild.currency} была успешно добавлена на рынок.`);
        break;
      case 'remove':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');

        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор кирки, которую вы хотите удалить');
        if (!guild.pickaxes?.find((p) => p.key === args[1])) return message.fail('Кирки с указанным вами идентификатором не существует на рынке данного сервера.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $pull: {
            pickaxes: { key: args[1] },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Кирка с идентификатором **${args[1]}** была успешно удалена.`);
        break;
      case 'buy':
        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор кирки, которую вы хотите купить.');
        const pickaxe = guild.pickaxes?.find((p) => p.key === args[1]);

        if (!pickaxe) return message.fail('Указанная вами кирка не была найдена на рынке данного сервера.');
        if (pickaxe.price > data.money) return message.fail('У вас недостаточно средств для покупки данной кирки.');
        if (data.ownedPickaxes?.includes(pickaxe.key)) return message.fail('У вас уже имеется эта кирка.');

        message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
          $inc: { money: -parseInt(pickaxe.price) },
          $push: { ownedPickaxes: pickaxe.key },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно приобрели данную кирку за **${pickaxe.price}**${guild.currency}. С нее вы будете получать от **${pickaxe.income}** до ~**${pickaxe.income * 2}**${guild.currency} за один раз.`);
        break;
      default:
        getHelp(message, this.name);
    }
  }
}

module.exports = PickaxeCommand;
