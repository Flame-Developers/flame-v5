const FlameListener = require('../../structures/FlameListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');
const InviteDetectorService = require('../../services/InviteDetectorService');
const AntiInviteService = require('../../services/AntiInviteService');

class MessageUpdateListener extends FlameListener {
  constructor() {
    super('MessageUpdateListener', { event: 'messageUpdate' });
  }

  async run(client, oldMessage, newMessage) {
    if (!newMessage.guild || oldMessage.content === newMessage.content) return;

    if (await InviteDetectorService.hasInvites(newMessage)) {
      await new AntiInviteService(newMessage.client, newMessage).applyActions();
    }
    const executor = new CommandsExecutorService(newMessage, client);
    return executor.runCommand();
  }
}

module.exports = MessageUpdateListener;
