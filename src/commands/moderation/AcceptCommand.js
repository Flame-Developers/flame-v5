const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class AcceptCommand extends FlameCommand {
  constructor() {
    super('accept', {
      description: 'Принять определенное предложение.',
      category: 'moderation',
      usage: 'accept <ID> [Комментарий]',
      aliases: [],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (!data.ideaChannel || !message.guild.channels.cache.has(data?.ideaChannel)) return message.reply('На данном сервере не установлен канал для предложений :no_entry:');
    if (data.ideas.length <= 0) return message.reply('На данном сервере еще не подавались предложения :no_entry:');

    const id = args[0];
    if (!id) return getHelp(message, this.name);
    if (isNaN(id) || !parseInt(id) || id <= 0) return message.reply('Укажите пожалуйста **верный** ID предложения :no_entry:');

    const channel = message.guild.channels.cache.get(data.ideaChannel);
    const suggestion = data.ideas.find((i) => i.id == parseInt(id));
    if (!suggestion) return message.reply('Предложения с указанным вами ID не существует :no_entry:');

    try {
      const msg = await channel.messages.fetch(suggestion.message);
      if (!msg) return message.reply('Сообщение с указанным вами предложением не было найдено :no_entry:');
      if (msg?.embeds.length <= 0) return message.reply('Найденное сообщение не содержит в себе вложений :no_entry:');

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
      message.reply(`✅ Предложению **#${id}** был успешно вынесен вердикт.`);
    } catch {
      message.reply('Сообщения с указанным вами предложением было удалено :no_entry:');
    }
  }
}

module.exports = AcceptCommand;
