const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const FlameCommand = require('../../structures/FlameCommand');

class BonusCommand extends FlameCommand {
  constructor() {
    super('bonus', {
      description: 'Активировать бонусы на сервере.',
      category: 'general',
      usage: 'bonus [activate/remove/list/info]',
      aliases: [],
      examples: [
        'f.bonus activate',
        'f.bonus remove 564403545273663489',
      ],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('subscriptions').findOne({ userID: message.author.id });
    const option = args[0];

    if (!data) return message.fail('Подписка Flame+, привязанная к вашему аккаунту не была найдена. Обратитесь на сервер поддержки, если считаете, что так быть не должно.');
    switch (option) {
      case 'activate':
        if (await message.guild.hasPremium()) return message.fail('Вы не можете активировать бонусные возможности на этом сервере, так как он их уже имеет.');
        if (data.premiumGuilds.length >= data.premiumGuildsMaxLength) return message.fail('У вас не осталось слотов для активации бонусов на данном сервере. Приобретите подписку получше, если хотите повысить данный лимит.');

        message.client.database.collection('subscriptions').updateOne({ userID: message.author.id }, { $push: { premiumGuilds: message.guild.id } });
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            premium: true,
          },
        });

        message.channel.send(
          new MessageEmbed()
            .setTitle('Юху, получилось! 🎉')
            .setDescription('На данном сервере были успешно активированы бонусные возможности. Отныне, серверу доступны все привилегии подписки **[Flame+](https://docs.flamebot.ru/misc/flame+)**.')
            .setColor('ffa500')
            .setFooter('Спасибо за поддержку')
            .setTimestamp(),
        );
        break;
      case 'remove':
        // eslint-disable-next-line no-case-declarations
        const id = args[1] || message.guild.id;
        if (!data?.premiumGuilds.includes(id)) return message.fail('У вас нет активированных бонусов на данном сервере.');

        message.client.database.collection('subscriptions').updateOne({ userID: message.author.id }, { $pull: { premiumGuilds: id } });
        message.client.database.collection('guilds').updateOne({ guildID: id }, {
          $set: {
            premium: false,
          },
        });

        message.channel.send(`${message.client.constants.emojis.DONE} С сервера **${id}** были успешно сняты бонусные возможности.`);
        break;
      case 'list':
        // eslint-disable-next-line no-case-declarations
        const embed = new MessageEmbed()
          .setTitle('Сервера с бонусами')
          .setColor('ffa500')
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();

        if (!data.premiumGuilds.length) embed.setDescription('Вы еще нигде не активировали бонусы. Сделайте это сейчас, прописав команду `bonus activate` на нужном вам сервере!');
        else {
          embed.setDescription('Вы всегда можете забрать бонус с того или иного сервера, воспользовавшись командой `bonus remove`.');
          embed.setThumbnail(message.client.user.avatarURL({ size: 2048 }));
          let index = 1;

          // eslint-disable-next-line no-restricted-syntax
          for (const guildID of data.premiumGuilds) {
            const guild = message.client.guilds.cache.get(guildID);
            // eslint-disable-next-line no-continue
            if (!guild) continue;

            embed.addField(`${index++}. ${guild?.name ?? 'Неизвестный сервер'}`, `Идентификатор сервера: \`${guildID}\``);
          }
        }
        message.channel.send(embed);
        break;
      default:
        return message.channel.send(
          new MessageEmbed()
            .setTitle('Подписка Flame+')
            .setColor('ffa500')
            // eslint-disable-next-line max-len
            .setDescription(`На текущий момент вы имеете активную подписку, которую приобрели **${moment(data.subscriptionDate).fromNow()}**.\n\nИспользовано бонусных слотов: **${data.premiumGuilds?.length ?? 0}/${data.premiumGuildsMaxLength}**.\nПродлить/отменить подписку можно на сайте [Boosty.to](https://boosty.to).`)
            .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp(),
        );
    }
  }
}

module.exports = BonusCommand;
