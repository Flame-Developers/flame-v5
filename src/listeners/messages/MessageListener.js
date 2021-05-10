const FlameListener = require('../../structures/FlameListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const { UserSchema } = require('../../utils/Schemas');

class MessageListener extends FlameListener {
  constructor() {
    super('MessageListener', { event: 'message' });
  }

  async run(client, message) {
    if (!message.guild) return;

    const user = await client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });
    if (!user && !message.author.bot) {
      // eslint-disable-next-line consistent-return
      return DatabaseHelper.createGuildMemberEntry(client, {
        options: { upsert: true },
        guild: message.guild.id,
        user: message.member.id,
        schema: UserSchema,
      });
    }

    const executor = new CommandsExecutorService(message, client);
    return executor.runCommand();
  }
}

module.exports = MessageListener;
