const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class DenyCommand extends FlameCommand {
  constructor() {
    super('deny', {
      description: 'Отклонить определённое предложение.',
      category: 'moderation',
      usage: 'deny <ID> [Комментарий]',
      aliases: [],
      examples: [
        'f.deny 123 Дубликат предложения #121.',
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
    // eslint-disable-next-line
    if (isNaN(id) || !parseInt(id) || id <= 0) return message.fail('Укажите пожалуйста **верный** ID предложения.');

    const channel = message.guild.channels.cache.get(data.ideaChannel);
    // eslint-disable-next-line radix
    const suggestion = data.ideas.find((i) => i.id === parseInt(id));
    if (!suggestion) return message.fail('Предложения с указанным вами ID не существует.');

    try {
      const msg = await channel.messages.fetch(suggestion.message);
      if (!msg) return message.fail('Сообщение с указанным вами предложением не было найдено.');
      if (msg?.embeds.length <= 0) return message.fail('Найденное сообщение не содержит в себе вложений.');

      msg.edit(
        new MessageEmbed()
          .setTitle(`Предложение №${id} (Отклонено)`)
          .setDescription(msg.embeds[0].description)
          .setColor('#FF3333')
          .addFields(
            msg.embeds[0].fields[0],
            {
              name: `${message.client.constants.emojis.FAIL} Ответ от ${message.author.tag} [${new Date().toLocaleString('ru')}]:`,
              value: args.slice(1).join(' ').length ? args.slice(1).join(' ').slice(0, 999) : 'Модератор не оставил дополнительного комментария.',
              inline: true,
            },
          )
          .setFooter(msg.embeds[0].footer.text, msg.embeds[0].footer?.iconURL)
          .setTimestamp(),
      );
      message.reply(`${message.client.constants.emojis.DONE} Предложению **#${id}** был успешно вынесен вердикт.`)
        .then((m) => setTimeout(() => m.delete(), 5000));
    } catch (error) {
      message.fail('При выполнении данного действия возникла ошибка. Попробуйте пожалуйста снова, либо обратитесь на сервер поддержки, если вы видите это не в первый раз.');
      console.error(error);
    }
  }
}

module.exports = DenyCommand;
