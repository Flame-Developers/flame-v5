const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class MassbanCommand extends FlameCommand {
  constructor() {
    super('massban', {
      description: 'Массово забанить пользователей на сервере.',
      category: 'moderation',
      usage: 'massban <...пользователи через запятую> [Причина]',
      aliases: [],
      examples: [
        'f.massban 553557567591284737, 422255876624351232, 525003205394825257 Спамеры',
      ],
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      cooldown: 10,
    });
  }

  async run(message, args) {
    const successBans = [];
    const failBans = [];

    let ids = args.join(' ').split(', ');
    let reason;

    if (ids[ids.length - 1].split(' ').length > 1) {
      reason = ids.slice(ids.length - 1)[0].split(' ').slice(1).join(' ');
    }
    ids = ids.join(' ').replace(reason, '').split(' ').filter(Boolean);
    if (!ids.length) return getHelp(message, this.name);
    if (ids.length > 30) return message.fail('Вы не можете заблокировать более **30** пользователей за раз.');
    if (reason?.length > 300) return message.fail('Длина причины блокировки не может превышать лимит в **300** символов.');

    for (const id of ids) {
      try {
        const member = message.guild.members.cache.get(id);
        if (!member || !member?.bannable) {
          failBans.push(id);
          // eslint-disable-next-line no-continue
          continue;
        }

        await message.guild.members.ban(id, { reason: `[${message.author.tag}]: ${reason ?? 'Причина отсутствует'}` });
        successBans.push(id);
      } catch {
        failBans.push(id);
      }
    }

    const embed = new MessageEmbed()
      .setTitle('Массовая блокировка пользователей')
      .setDescription(`Модератор: **${message.author.tag}** (${message.author.id})\nПричина: **${reason ?? 'Причина отсутствует'}**`)
      .addField(`${message.client.constants.emojis.DONE} Заблокированные пользователи (${successBans.length}):`, successBans.length ? successBans.map((id) => `**${id}**`).slice(0, 999).join('\n') : 'Данные отсутствуют.', true)
      .addField(`${message.client.constants.emojis.FAIL} Не заблокированные пользователи (${failBans.length}):`, failBans.length ? failBans.map((id) => `**${id}**`).slice(0, 999).join('\n') : 'Данные отсутствуют.', true)
      .setColor('ff3333')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

    return message.channel.send(embed);
  }
}

module.exports = MassbanCommand;
