const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class AcceptCommand extends FlameCommand {
  constructor() {
    super('accept', {
      description: 'Принять определённое предложение.',
      category: 'moderation',
      usage: 'accept <ID предложения> [Комментарий]',
      aliases: [],
      examples: [
        'f.accept 2 Хорошее предложение!',
      ],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (!data.ideaChannel || !message.guild.channels.cache.has(data?.ideaChannel)) return message.fail('На данном сервере не установлен канал для предложений.');
    if (data.ideas.length <= 0) return message.fail('На данном сервере ещё не подавались предложения.');

    const id = args[0];
    if (!id) return getHelp(message, this.name);
    if (isNaN(id) || !parseInt(id) || id <= 0) return message.fail('Укажите пожалуйста **верный** ID предложения.');

    const channel = message.guild.channels.cache.get(data.ideaChannel);
    const suggestion = data.ideas.find((i) => i.id === parseInt(id));
    if (!suggestion) return message.fail('Предложения с указанным вами ID не существует.');

    try {
      const msg = await channel.messages.fetch(suggestion.message);
      if (!msg) return message.fail('Сообщение с указанным вами предложением не было найдено.');
      if (msg?.embeds.length <= 0) return message.fail('Найденное сообщение не содержит в себе вложений.');

      msg.edit(
        new MessageEmbed()
          .setAuthor(msg.embeds[0].author.name, msg.embeds[0].author.iconURL)
          .setDescription(msg.embeds[0].description)
          .setColor('#A5FF2A')
          .setTitle(`Предложение #${suggestion.id} (Принято)`)
          .addField(`Ответ от ${message.author.tag}:`, args.slice(1).join(' ') ? args.slice(1).join(' ').slice(0, 999) : 'Комментарий не указан.')
          .setImage(msg.embeds[0].image ? msg.embeds[0].image.url : null)
          .setFooter(`Предложение рассмотрено: ${new Date().toISOString().replace('T', ' ').substr(0, 19)}`),
      );
      message.reply(`${message.client.constants.emojis.DONE} Предложению **#${id}** был успешно вынесен вердикт.`);
    } catch {
      message.fail('Сообщение с указанным вами предложением было удалено.');
    }
  }
}

module.exports = AcceptCommand;
