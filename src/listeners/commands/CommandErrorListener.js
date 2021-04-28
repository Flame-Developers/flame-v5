const { MessageEmbed } = require('discord.js');
const FlameListener = require('../../structures/FlameListener');

class CommandErrorListener extends FlameListener {
  constructor() {
    super('CommandErrorListener', { event: 'commandError' });
  }

  run(error, message) {
    console.error(error)

    return message.channel.send(
      new MessageEmbed()
        .setTitle('Упс, что-то пошло не так…')
        .setDescription(
          'При выполнении данной команды возникла ошибка. Попробуйте пожалуйста позже, или обратитесь на сервер поддержки.'
        )
        .setColor('#ff3333')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp()
    );
  }
}

module.exports = CommandErrorListener;
