const FlameListener = require('../../structures/FlameListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');
const { UserSchema } = require('../../utils/Schemas');

class MessageListener extends FlameListener {
  constructor() {
    super('MessageListener', { event: 'message' });
  }

  async run(client, message) {
    if (!message.guild) return;

    const user = await client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    if (!user && !message.author.bot) {
      return await client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, { $set: UserSchema }, { upsert: true });
    }

    const executor = new CommandsExecutorService(message, client);
    return executor.runCommand();
  }
}

module.exports = MessageListener;
