const FlameListener = require('../../structures/FlameListener');
const InteractionResponse = require('../../utils/interactions/InteractionResponse');
const InteractionData = require('../../utils/interactions/InteractionData');
const GuildDataCache = require('../../structures/cache/GuildDataCache');

class InteractionCreateListener extends FlameListener {
  constructor() {
    super('InteractionCreateListener', {
      ws: true,
      event: 'INTERACTION_CREATE',
    });
  }

  async run(client, interaction) {
    switch (interaction.type) {
      case 2:
        const [data, callback] = [
          new InteractionData(client, interaction),
          new InteractionResponse(client, interaction),
        ];
        // We are also validating guild cache on slash command usage.
        if (!data.guild?.cache) {
          const guildData = await client.database.collection('guilds').findOne({ guildID: data.guild.id });
          data.guild.cache = new GuildDataCache(guildData);
        }
        try {
          const irn = client.interactions.get(interaction.data.name);

          if (irn) {
            if (irn.premium && !data.guild?.cache?.premium) {
              return callback.send(':star: Вы наткнулись на бонусную возможность!\nДанная команда доступна только пользователям, которые поддержали наш проект материально. Перейдите [сюда](https://docs.flamebot.ru/flame+) для подробной информации.');
            }
            if (irn.category === 'music' && irn.djOnly && data.guild?.cache?.dj && !data.member.roles.cache.has(data.guild?.cache?.dj)) {
              return callback.send(`🚫 Вы должны иметь роль DJ'ея (<@&${data.guild.cache.dj}>) чтобы управлять музыкальным плеером.`, { flags: 64 });
            }
            return irn.run(client, data);
          }
        } catch (err) {
          callback.send('🚫 Произошла ошибка при обработке интеракции. Посетите [данную страницу](https://docs.flamebot.ru/faq) для списка возможных причин.');
          console.error(err);
        }
        break;
      case 3:
        if (client.cache.buttons.has(interaction.message.id)) {
          // eslint-disable-next-line max-len
          client.cache.buttons.get(interaction.message.id)(new InteractionData(client, interaction));
          return client.api.interactions(interaction.id, interaction.token)
            .callback.post({ data: { type: 6 } })
            .catch(() => {});
        }
    }
  }
}

module.exports = InteractionCreateListener;
