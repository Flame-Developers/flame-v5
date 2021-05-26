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
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('subscriptions').findOne({ userID: message.author.id });
    const option = args[0];

    if (!data) return message.reply('К сожалению, я не смог найти подписку привязанную к вашему Discord-аккаунту. Обратитесь на сервер поддержки если вы считаете, что так быть не должно :pensive:');
    switch (option) {
      case 'activate':
        if (await message.guild.hasPremium()) return message.reply('У данного сервера уже имеются бонусные возможности :no_entry:');
        if (data.premiumGuilds.length >= data.premiumGuildsMaxLength) return message.reply('Похоже, у вас не осталось слотов для активации бонусов на данном сервере. Может вам нужна подписка по-лучше? :no_entry:');

        message.client.database.collection('subscriptions').updateOne({ userID: message.author.id }, { $push: { premiumGuilds: message.guild.id } });
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, { $set: { premium: true } });

        message.channel.send(':tada: Бонусные возможности были успешно активированы на данном сервере!');
        break;
      case 'remove':
        // eslint-disable-next-line no-case-declarations
        const id = args[1];
        if (!id) return message.reply('Укажите пожалуйста ID сервера, с которого вы хотите снять бонусы :no_entry:');
        if (!data?.premiumGuilds.includes(id)) return message.reply('У вас нет активированных бонусов на указанном сервере :no_entry:');

        message.client.database.collection('subscriptions').updateOne({ userID: message.author.id }, { $pull: { premiumGuilds: id } });
        message.client.database.collection('guilds').updateOne({ guildID: id }, { $set: { premium: false } });

        message.channel.send(`✅ С сервера **${id}** были успешно сняты бонусные возможности.`);
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
            if (!guild) continue;

            embed.addField(`${index++}. ${guild?.name ?? 'Неизвестный сервер'}`, `ID сервера: \`${guildID}\``);
          }
        }
        message.channel.send(embed);
        break;
      default:
        return message.channel.send(
          new MessageEmbed()
            .setTitle('Премиум-подписка')
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
