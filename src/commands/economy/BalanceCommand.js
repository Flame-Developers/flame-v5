/* eslint-disable no-case-declarations */
const { MessageAttachment, MessageEmbed } = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
const { PaginatorUtil, PaginatorEntry } = require('../../utils/misc/PaginatorUtil');
const FlameCommand = require('../../structures/FlameCommand');
const { formatNumber } = require('../../utils/Functions');
const { premiumRequired } = require('../../utils/Errors');

class BalanceCommand extends FlameCommand {
  constructor() {
    super('balance', {
      description : 'Посмотреть свой баланс на сервере.',
      category: 'economy',
      usage: 'balance [@Пользователь/ID]',
      aliases: ['bal', 'money'],
      examples: [
        'f.balance',
        'f.balance @TheFerryn#0001',
      ],
      clientPermissions: ['ATTACH_FILES'],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'card':
        const entries = [];
        if (!await message.client.database.collection('subscriptions').findOne({ userID: message.author.id })) return premiumRequired(message);

        for (const card of message.client.constants.balanceCardTypes) {
          entries.push(
            new PaginatorEntry(
              'ℹ️ [Для того, чтобы начать использовать определенный тип каточки, отправьте ее идентификатор в течении **30** секунд.]',
              new MessageEmbed()
                .setTitle(`Идентификатор карточки: #${card.id}`)
                .setColor('ffa500')
                .setImage(card.image)
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp(),
            ),
          );
        }
        // eslint-disable-next-line max-len
        const paginator = await new PaginatorUtil(message.client, message.author, entries, {
          disableCloseButton: true,
        });
        paginator.init(message.channel);

        await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 25000, errors: ['time'] })
          .then((collected) => {
            const val = Number(collected.first().content);
            if (!message.client.constants.balanceCardTypes.find((c) => c.id === val)) message.fail('Карточки с указанным вами идентификатором не существует.');
            else {
              message.client.database.collection('guildusers').updateOne({ guildID: message.guild.id, userID: message.author.id }, {
                $set: {
                  balanceCardType: val,
                },
              });
              message.reply(`${message.client.constants.emojis.DONE} Вы успешно установили вариант **#${val}** в качестве карточки на данном сервере.`);
            }
            paginator.destroy();
          })
          .catch(() => {
            paginator.destroy();
            message.fail('Я не дождался от вас ответа в течении **30** секунд. Процесс был отменен.');
          });
        break;
      default:
        // eslint-disable-next-line max-len
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });

        if (!data) return message.fail('Указанный вами пользователь не был найден в базе данного сервера.');

        const canvas = Canvas.createCanvas(1375, 855);
        const ctx = canvas.getContext('2d');
        await Canvas.registerFont(path.join(process.cwd(), 'src/static/fonts/Comfortaa-Bold.ttf'), { family: 'Comfortaa' });

        const currency = guild?.currency?.length < 3 ? guild.currency : '';
        // eslint-disable-next-line max-len
        const image = await Canvas.loadImage(data.balanceCardType ? message.client.constants.balanceCardTypes.find((card) => card.id === data.balanceCardType)?.image : message.client.constants.balanceCardTypes[0].image);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '69px Comfortaa';
        ctx.fillText(`${formatNumber(data.money)}${currency}`, canvas.width / 3.8, canvas.height / 2.07);
        ctx.fillText(`${formatNumber(data.bank)}${currency}`, canvas.width / 3.8, canvas.height / 1.525);
        ctx.fillText(`${formatNumber(data.money + data.bank)}${currency}`, canvas.width / 3.8, canvas.height / 1.21);

        await message.channel.send(`> Карточка пользователя **${user.user.tag}** (${user.id}).`, new MessageAttachment(canvas.toBuffer(), 'balance.png'));
    }
  }
}

module.exports = BalanceCommand;
