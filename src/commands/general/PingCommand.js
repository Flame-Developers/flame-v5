const FlameCommand = require('../../structures/FlameCommand');

class PingCommand extends FlameCommand {
  constructor() {
    super('ping', {
      description: 'Сообщает задержку бота.',
      usage: 'ping',
      cooldown: 3,
      aliases: [],
    });
  }

  run(message, args) {
    return message.reply(`🏓 Pong! **${message.client.ws.ping}ms**`);
  }
}

module.exports = PingCommand;
