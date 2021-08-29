/* eslint-disable no-case-declarations */
const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class TransportCommand extends FlameCommand {
  constructor() {
    super('transport', {
      description: 'Управление транспортами.',
      category: 'economy',
      usage: 'transport <add/remove/list/buy>',
      aliases: [],
      examples: [
        'f.transport add Вагонетка carriage 700 mine',
        'f.transport buy carriage',
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
            .setAuthor('Список доступного транспорта', 'https://www.pikpng.com/pngl/b/80-809078_car-emoji-png-icon-car-emoji-clipart.png')
            .setColor('ffa500')
            .setDescription(
              guild.transport?.length
                ? guild.transport.map((x) => `**${x.name}** (\`${x.key}\`) | ${x.price}${guild.currency} | ${data.ownedTransport?.includes(x.key) ? '🔓' : '🔒'}`)
                : 'Список доступного для покупки транспорта на данном сервере пуст.',
            )
            .addField('Подсказка', `Транспорт иногда необходим для использования некоторых команд. Купить его вы можете командой \`${guild.prefix}transport buy\`.`),
        );
        break;
      case 'add':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');
        const hasPremium = message.guild.cache.premium;
        // eslint-disable-next-line no-mixed-operators
        if (!hasPremium && guild.transport?.length >= 5 || hasPremium && guild.transport?.length >= 10) return message.fail(`Вы достигли лимита транспорта на этом сервере. ${!hasPremium ? 'Приобретите Flame+ для повышенных лимитов.' : ''}`);

        // eslint-disable-next-line no-unused-vars
        const [_, name, key, price, requiredFor] = args;
        const allowedCommands = ['work', 'crime', 'mine', 'fish', 'chop'];

        if (!name) return message.fail('Укажите пожалуйста название транспорта.');
        if (name.length >= 20) return message.fail('Название транспорта не должно содержать в себе более 20ти символов.');

        if (!key) return message.fail('Укажите пожалуйста идентификатор транспорта.');
        if (key.length >= 10) return message.fail('Идентификатор транспорта не должен превышать лимит в **10** символов.');
        if (guild.transport?.find((t) => t.key === key)) return message.fail('На этом сервере уже имеется транспорт с таким идентификатором.');

        if (!price || isNaN(price) || !parseInt(price)) return message.fail('Укажите пожалуйста стоимость данного транспорта.');
        if (parseInt(price) < 1 || parseInt(price) > 1000000) return message.fail('Стоимость транспорта не должна быть меньше **1** и больше **1,000,000**.');

        if (requiredFor && !allowedCommands.includes(requiredFor)) return message.fail('Указанной команды не существует, либо она не поддерживает взаимодействие с транспортом.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $push: {
            transport: {
              name,
              key,
              price,
              requiredFor: requiredFor ?? null,
            },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Транспорт **${name}** с идентификатором **${key}**, стоимостью в **${price}**${guild.currency} был успешно добавлен.`);
        break;
      case 'remove':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');

        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор транспорта, который вы хотите удалить.');
        if (!guild.transport?.find((t) => t.key === args[1])) return message.fail('Транспорта с указанным вами идентификатором не существует на рынке данного сервера.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $pull: {
            transport: { key: args[1] },
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Транспорт с идентификатором **${args[1]}** был успешно удален.`);
        break;
      case 'buy':
        if (!args[1]) return message.fail('Укажите пожалуйста идентификатор транспорта, который вы хотите купить.');
        const transport = guild.transport?.find((t) => t.key === args[1]);

        if (!transport) return message.fail('Указанный вами транспорт не был найден на рынке данного сервера.');
        if (transport.price > data.money) return message.fail('У вас недостаточно средств для покупки данного транспорта..');
        if (data.ownedTransport?.includes(transport.key)) return message.fail('У вас уже имеется этот транспорт.');

        message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
          $inc: { money: -parseInt(transport.price) },
          $push: { ownedTransport: transport.key },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Вы успешно приобрели данный вид транспорта за **${transport.price}**${guild.currency}. ${transport.requiredFor ? `Отныне, вы сможете использовать его для команды \`${transport.requiredFor}\`.` : ''}`);
        break;
      default:
        getHelp(message, this.name);
    }
  }
}
module.exports = TransportCommand;
