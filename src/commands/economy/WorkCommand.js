/* eslint-disable */
const { MessageEmbed } = require('discord.js');
const StringParserUtil = require('../../utils/misc/StringParserUtil');
const { randomize } = require('../../utils/Functions');
const CooldownManager = require('../../managers/CooldownManager');
const FlameCommand = require('../../structures/FlameCommand');

class WorkCommand extends FlameCommand {
  constructor() {
    super('work', {
      description: 'Выйти на работу и заработать денег.',
      category: 'economy',
      usage: 'work [phrases/income]',
      aliases: [],
    });
  }

  async run(message, args) {
    const manager = new CooldownManager(message.client);
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const user = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    const option = args[0];

    switch (option) {
      case 'income':
        if (!message.member.permissions.has('MANAGE_GUILD')) return message.fail('У вас недостаточно прав для выполнения данного действия.');
        const numbers = args.slice(1, 3);

        if (numbers.some((a) => !parseInt(a)) || numbers.length !== 2)
          return message.fail('Укажите пожалуйста новую сумму заработка.');
        if (numbers.some((a) => +a > 100000 || +a <= 0))
          return message.fail('Сумма максимального/минимального заработка не должна превышать **100000**/быть меньше **1**.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            'work.min': parseInt(args[1]),
            'work.max': parseInt(args[2]),
          },
        });
        await message.react('✅');
        break;
      default:
        const cooldown = await manager
          .find({ guildID: message.guild.id, userID: message.author.id, command: this.name });

        if (cooldown) {
          const expirationTimestamp = (cooldown?.ends / 1000).toFixed(0);
          return message.fail(`Данная команда использует задержку, возвращайтесь снова примерно <t:${expirationTimestamp}:R> (<t:${expirationTimestamp}>).`);
        }

        const transport = data.transport?.find((t) => t.requiredFor === this.name);
        if (transport && !user.ownedTransport?.includes(transport.key)) return message.fail(`Для выполнения данного действия вам необходимо иметь транспорт "**${transport.name}**".`);

        const defaultPhrases = [
          'Вы пошли на завод и заработали {{amount}}{{currency}}.',
          'Вы устроились работать уборщиком в школе, и в первый день заработали {{amount}}{{currency}}',
          'Вы решили поиграть на курсах валют и ушли в плюс на {{amount}}{{currency}}',
          'Вы решили инвестировать в DogeCoin, и по итогу заработали {{amount}}{{currency}}.',
        ];
        const phrases = data.work?.phrases?.length ? data.work.phrases : defaultPhrases;
        const income = randomize(data.work?.min, data.work?.max);

        message.channel.send(
          new MessageEmbed()
            .setTitle(StringParserUtil.parse(phrases[randomize(0, phrases?.length - 1)], { amount: income, currency: data.currency }))
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setColor('ffa500')
            .setTimestamp(),
        );
        message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
          $inc: {
            money: income,
          },
        });

        return manager.create(
          {
            guildID: message.guild.id,
            userID: message.author.id,
            command: this.name,
            ends: Date.now() + data.cooldown[this.name] * 1000,
          },
        );
    }
  }
}

module.exports = WorkCommand;