const StatisticsSenderService = require('../../services/StatisticsSenderService');
const FlameListener = require('../../structures/FlameListener');
const { GuildSchema } = require('../../utils/Schemas');

class GuildCreateListener extends FlameListener {
  constructor() {
    super('GuildCreateListener', { event: 'guildCreate' });
  }

  async run(client, guild) {
    await new StatisticsSenderService(client).send();
    const data = await client.database.collection('guilds').findOne({ guildID: guild.id });

    if (!data) {
      guild?.channels.cache.filter((c) => guild.me.permissionsIn(c).has('SEND_MESSAGES') && c.type === 'text').first().send(
        `Привет, спасибо что добавили меня на **${guild.name}**! :wave:\nДля того чтобы начать работать со мной, загляните в документацию, там вы найдете много чего полезного: <https://docs.flamebot.ru>\nУзнать о боте и его функционале вам позволит наш сайт: https://flamebot.ru\n\nЕсли у вас все еще остались вопросы, либо возникли трудности, обязательно обращайтесь на сервер поддержки. Мы постараемся помочь вам в любую минуту :heart:\nВы можете также поддержать проект материально, и открыть для себя бонусные возможности. Для этого, перейдите на страницу <https://flamebot.ru/donate>.\n\nhttps://discord.gg/7FUJPRCsw8`,
      );
      return client.database.collection('guilds').updateOne({ guildID: guild.id }, { $set: GuildSchema }, { upsert: true });
    }
  }
}

module.exports = GuildCreateListener;
