const { MessageAttachment } = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');
const { join } = require('path');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class DemotivatorCommand extends FlameCommand {
  constructor() {
    super('demotivator', {
      description: 'Сгенерировать демотиватор.',
      category: 'fun',
      usage: 'demotivator <Верхний текст> | [Нижний текст]',
      aliases: ['dem'],
      cooldown: 5,
      clientPermissions: ['ATTACH_FILES'],
      examples: [
        'f.demotivator я не понимаю | почему эта команда такая крутая',
      ],
    });
  }

  async run(message, args) {
    const addNewLines = (str) => {
      let res = ' ';
      while (str.length > 0) {
        res += `${str.substring(0, 45)}\n`;
        str = str.substring(45);
      }
      return res;
    };
    const text = args.join(' ').split(' | ');
    const attachment = message.attachments.first();
    let image;

    if (attachment?.url?.endsWith('.png') || attachment?.url?.endsWith('.jpg')) image = attachment.proxyURL;
    else image = message.author.displayAvatarURL({ size: 2048, format: 'png' });

    if (!text[0].length) return getHelp(message, this.name);
    if (text[0]?.length > 34) return message.fail('Длина верхнего текста не должна превышать лимит в **34** символа');

    message.channel.startTyping();
    const canvas = createCanvas(768, 540);
    const ctx = canvas.getContext('2d');
    await registerFont(join(process.cwd(), 'src/static/fonts/Times New Roman.ttf'), { family: 'Times New Roman' });

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const strokeX = canvas.width * 0.1;
    const strokeY = canvas.height * 0.06;
    const strokeWidth = canvas.width - strokeX * 2;
    const strokeHeight = canvas.height - strokeY * 6;
    const gap = canvas.width * 0.01;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(strokeX, strokeY, strokeWidth, strokeHeight);

    ctx.fillStyle = 'white';
    ctx.font = '50px Times New Roman';
    ctx.textBaseLine = 'middle';
    ctx.textAlign = 'center';

    ctx.fillText(text[0], canvas.width / 2, canvas.height / 1.22);

    if (text[1]) {
      ctx.font = '30px Times New Roman';
      ctx.fillText(text[1].length <= 50
        ? text[1]
        : addNewLines(text[1]).toString(), canvas.width / 2, canvas.height / 1.1);
    }

    ctx.drawImage(
      await loadImage(image),
      strokeX + gap, strokeY + gap, strokeWidth - gap * 2, strokeHeight - gap * 2,
    );

    message.reply(
      new MessageAttachment(canvas.toBuffer(), 'demotivator.png'),
    );
    message.channel.stopTyping();
  }
}

module.exports = DemotivatorCommand;
