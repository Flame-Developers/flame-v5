const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class SuggestCommand extends FlameCommand {
  constructor() {
    super('suggest', {
      description: 'Отправить предложение для сервера.',
      category: 'general',
      usage: 'suggest <Предложение>',
      aliases: [],
      cooldown: 3,
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (!data.ideaChannel) return message.fail('На данном сервере не установлен канал для предложений. Обратитесь к администратору для решения данной проблемы.');

    const user = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    if (user.idesBlacklist) return message.fail('Вы не можете использовать данную команду, так как находитесь в черном списке предложений данного сервера.');

    const suggestion = args.join(' ');

    if (!suggestion) return getHelp(message, this.name);
    if (suggestion.length > 1850) return message.fail('Длина предложения не должна превышать лимит в **1850** символов.');
    if (!message.guild.me.permissionsIn(data.ideaChannel).has('SEND_MESSAGES')) return message.fail('У меня нет прав на отправку сообщений в текущий канал предложений на сервере.');

    message.reply('Вы уверены, что хотите отправить свою идею? Данное действие нельзя будет отменить.').then((m) => {
      const collector = m.createReactionCollector((reaction, user) => user.id === message.author.id, { max: 1 });
      collector.on('collect', async (reaction) => {
        if (reaction.emoji.name == '✅') {
          const id = (data.ideas?.length ?? 0) + 1;

          const msg = await message.guild.channels.cache.get(data.ideaChannel).send(
            new MessageEmbed()
              .setTitle(`Предложение #${id}`)
              .setColor('ffa500')
              .setFooter(message.guild.name, message.guild.iconURL())
              .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
              .setDescription(suggestion)
              .setImage(message.attachments.first() ? message.attachments.first().proxyURL : null)
              .setTimestamp(),
          );
          ['👍', '👎'].forEach((r) => msg.react(r));
          message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
            $push: {
              ideas: {
                id,
                message: msg.id,
              },
            },
          });

          return m.edit(`Ваша идея была успешно отправлена. ID предложения: **${id}**`);
        } if (reaction.emoji.name == '❎') {
          return m.edit('Отменено.');
        }
      });
      ['✅', '❎'].forEach((r) => m.react(r));
    });
  }
}

module.exports = SuggestCommand;
