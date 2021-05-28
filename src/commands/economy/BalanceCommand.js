const { MessageAttachment } = require('discord.js');
const path = require('path');
const Canvas = require('canvas');
const FlameCommand = require('../../structures/FlameCommand');
const { formatNumber } = require('../../utils/Functions');

class BalanceCommand extends FlameCommand {
  constructor() {
    super('balance', {
      description : 'Посмотреть свой баланс на сервере.',
      category: 'economy',
      usage: 'balance [@Пользователь/ID]',
      aliases: ['bal', 'money'],
      clientPermissions: ['ATTACH_FILES'],
    });
  }

  async run(message, args) {
    const guild = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    // eslint-disable-next-line max-len
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await message.client.database.collection('guildusers').findOne({ guildID: message.guild.id, userID: user.id });

    if (!data) return message.fail('Указанный вами пользователь не был найден в базе данного сервера.');

    const canvas = Canvas.createCanvas(1375, 855);
    const ctx = canvas.getContext('2d');
    await Canvas.registerFont(path.join(process.cwd(), 'src/static/fonts/Comfortaa-Bold.ttf'), { family: 'Comfortaa' });

    const currency = guild?.currency?.length < 3 ? guild.currency : '';
    const image = await Canvas.loadImage(path.join(process.cwd(), 'src/static/assets/card-black.png'));
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '69px Comfortaa';
    ctx.fillText(`${formatNumber(data.money)}${currency}`, canvas.width / 3.8, canvas.height / 2.07);
    ctx.fillText(`${formatNumber(data.bank)}${currency}`, canvas.width / 3.8, canvas.height / 1.525);
    ctx.fillText(`${formatNumber(data.money + data.bank)}${currency}`, canvas.width / 3.8, canvas.height / 1.21);

    await message.channel.send(`> Карточка пользователя **${user.user.tag}** (${user.id}).`, new MessageAttachment(canvas.toBuffer(), 'balance.png'));
  }
}

module.exports = BalanceCommand;
