/* eslint-disable */
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const StringParserUtil = require('../../utils/StringParserUtil');
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
      default:
        const cooldown = await manager.find({ guildID: message.guild.id, userID: message.author.id, command: this.name });
        if (cooldown) {
          return message.channel.send(`Данная команда использует задержку, попробуйте снова через **${moment(cooldown.ends).fromNow()}** :stopwatch:`);
        }
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
        return manager.handle(
          {
            guildID: message.guild.id,
            userID: message.author.id,
            command: this.name,
            ends: Date.now() + data.cooldown[this.name] * 1000,
          }
        );
    }
  }
}

module.exports = WorkCommand;