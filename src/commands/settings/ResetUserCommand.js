const ActionConfirmationUtil = require('../../utils/misc/ActionConfirmationUtil');
const FlameCommand = require('../../structures/FlameCommand');

class ResetUserCommand extends FlameCommand {
  constructor() {
    super('reset-user', {
      description: 'Удалить пользователя из локальной базы данных сервера.',
      category: 'settings',
      usage: 'reset-user <ID>',
      aliases: [],
      examples: [
        'f.reset-user 422255876624351232',
      ],
      cooldown: 60,
      userPermissions: ['ADMINISTRATOR'],
    });
  }

  async run(message, args) {
    const user = await message.client.database.collection('guildusers')
      .findOne({ guildID: message.guild.id, userID: args[0] });

    if (!user) return message.fail('Указанный вами пользователь не был найден в локальной базе данного сервера.');
    await new ActionConfirmationUtil(message.client, message.author).init(`Вы уверены, что хотите удалить пользователя **${args[0]}** из локальной базы данных этого сервера? Ему придется отправить как минимум одно сообщение, чтобы попасть в базу вновь.\n__Это сбросит все предупреждения, а также весь прогресс участника в экономике на данном сервере.__ `, message.channel).then(async (response) => {
      if (response) {
        message.client.database.collection('guildusers').deleteOne({ guildID: message.guild.id, userID: args[0] });
        message.reply(`${message.client.constants.emojis.DONE} Пользователь **${args[0]}** был успешно удален.`);
      } else message.fail('Операция была отменена.');
    });
  }
}

module.exports = ResetUserCommand;
