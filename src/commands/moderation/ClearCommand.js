const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class ClearCommamd extends FlameCommand {
  constructor() {
    super('clear', {
      description: 'Очищает определенное кол-во сообщений в канале.',
      category: 'moderation',
      usage: 'clear <Кол-во сообщений>',
      aliases: ['purge'],
      cooldown: 3,
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(message, args) {
    if (!args[0]) return getHelp(message, this.name);
    if (isNaN(args[0]) || parseInt(args[0]) < 1 || parseInt(args[0]) >= 1000 || !parseInt(args[0])) return message.reply('Укажите пожалуйста __верное__ число сообщений (от 1 до 1000) :no_entry:');

    try {
      let deleted = 0;

      do {
        let messages = await message.channel.messages.fetch({ limit: 100 });
        messages = messages.map((m) => m.id).filter((m) => m !== message.id).slice(0, parseInt(args[0]) - deleted);

        await message.channel.bulkDelete(messages).catch(null);
        if (messages.length < 1) break;

        deleted += messages.length;
      } while (deleted !== parseInt(args[0]));

      return message.channel.send(`✅ Успешно удалил **${args[0]}** сообщений!`);
    } catch {
      return message.channel.send('Я не могу удалять сообщения старше **14** дней :no_entry:');
    }
  }
}

module.exports = ClearCommamd;
