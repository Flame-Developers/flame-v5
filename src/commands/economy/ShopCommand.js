const { MessageEmbed } = require('discord.js');
const { PaginatorUtil, PaginatorEntry } = require('../../utils/misc/PaginatorUtil');
const FlameCommand = require('../../structures/FlameCommand');

class ShopCommand extends FlameCommand {
  constructor() {
    super('shop', {
      description: 'Вызвать магазин ролей сервера.',
      category: 'economy',
      usage: 'shop',
      aliases: [],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (!data.items?.length) return message.reply('Магазин данного сервера пуст, поскольку администраторы еще не успели добавить в него предметов. Возвращайтесь позже.');

    const entries = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Math.ceil(data.items.length / 10); i++) {
      const embed = new MessageEmbed()
        .setTitle('Магазин сервера')
        .setColor('ffa500')
        .setDescription(`Купить определенный товар в магазине можно при помощи команды \`${data.prefix}buy\`.`)
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();

      data.items.slice(i * 10, i * 10 + 10)
        // eslint-disable-next-line array-callback-return
        .map((item) => {
          const role = message.guild.roles.cache.get(item.roleId) ?? null;
          if (!role) {
            message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
              $pull: {
                items: { roleId: item.roleId },
              },
            });
            return;
          }
          embed.addField(`${role.name} (${role.id}) — **${item.cost}**${data.currency}`, (item.description ?? 'Описание предмета не установлено.'));
        });
      entries.push(
        new PaginatorEntry(null, embed),
      );
    }
    return new PaginatorUtil(message.client, message.author, entries).init(message.channel, 150);
  }
}

module.exports = ShopCommand;
