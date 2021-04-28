const FlameListener = require('../../structures/FlameListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');

class MessageUpdateListener extends FlameListener {
  constructor() {
    super('MessageUpdateListener', { event: 'messageUpdate' });
  }

  run(client, oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) return;

    const executor = new CommandsExecutorService(newMessage, client);
    return executor.runCommand();
  }
}

module.exports = MessageUpdateListener;
