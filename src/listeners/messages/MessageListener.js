const FlameListener = require('../../structures/FlameListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');
const DatabaseHelper = require('../../helpers/DatabaseHelper');
const InviteDetectorService = require('../../services/InviteDetectorService');
const AntiInviteService = require('../../services/AntiInviteService');
const { UserSchema } = require('../../utils/Schemas');

class MessageListener extends FlameListener {
  constructor() {
    super('MessageListener', { event: 'message' });
  }

  async run(client, message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    if (await InviteDetectorService.hasInvites(message)) {
      await new AntiInviteService(message.client, message).applyActions();
    }
    if ([`<@!${client.user.id}>`, `<@${client.user.id}>`].includes(message.content)) {
      message.reply(`:wave: Привет! Для того, чтобы посмотреть полный список команд, воспользуйтесь командой \`${message.guild.cache?.prefix ?? ''}help\`.\nНе забудьте также посетить документацию: https://docs.flamebot.ru.`);
    }
    const user = await client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: message.author.id });

    if (!user) {
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
