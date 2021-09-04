const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const { PaginatorUtil, PaginatorEntry } = require('../../utils/misc/PaginatorUtil');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');
const ReminderManager = require('../../managers/ReminderManager');

class ReminderCommand extends FlameCommand {
  constructor() {
    super('reminder', {
      description: 'Управление вашими напоминаниями.',
      category: 'general',
      usage: 'reminder <create/remove/list>',
      aliases: [],
      examples: [
        'f.reminder create 25m Пойти покушать!',
        'f.reminder remove 4b1c9397b0171f5283e3b77aa5991e3f',
      ],
    });
  }

  async run(message, args) {
    const option = args[0];
    const manager = new ReminderManager(message.client);

    switch (option) {
      case 'create':
        const time = args[1];
        if (!time) {
          return message.fail(
            'Укажите пожалуйста длительность напоминания.',
          );
        }
        if (!ms(time) || ms(time) > ms('14d') || ms(time) < ms('1m')) {
          return message.fail(
            'Длительность напоминания должна быть от одной минуты до 14-ти дней.',
          );
        }

        const date = new Date(Date.now() + ms(time)).getTime();
        const id = manager.generateID();

        await message.react('✅');
        manager.create(
          {
            userID: message.author.id,
            id,
            timeout: Date.now() + ms(time),
            details: {
              message:
                args.slice(2).join(' ').slice(0, 1799)
                || 'Вы создали напоминание, но забыли указать сообщение. Потрясающий ход!',
            },
          },
        );
        message.channel.send(`${message.client.constants.emojis.DONE} Я напомню вам об этом <t:${(date / 1000).toFixed()}> (ID напоминания: \`${id}\`)`);
        break;
      case 'remove':
        if (!args[1]) {
          return message.fail(
            'Укажите пожалуйста ID напоминания которое вы хотите удалить.',
          );
        }
        if (!(await manager.find({ userID: message.author.id, id: args[1] }))) {
          return message.fail(
            'Указанного вами напоминания не существует.',
          );
        }

        manager.delete({ userID: message.author.id, id: args[1] });
        message.reply(`${message.client.constants.emojis.DONE} Напоминание было успешно удалено.`);
        break;
      case 'list':
        const data = await message.client.database.collection('reminders').find({ userID: message.author.id }).toArray();
        if (!data.length) return message.fail('На текущий момент вы не имеете активных напоминаний.');

        const entries = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < Math.ceil(data.length / 10); i++) {
          const embed = new MessageEmbed()
            .setTitle('Список напоминаний')
            .setDescription(`Общее количество активных напоминаний: **${data.length ?? '-'}**`)
            .setColor('ffa500')
            .setThumbnail(message.guild.iconURL())
            .setFooter(message.guild.name, message.guild.iconURL())
            .setTimestamp();

          data.slice(i * 10, i * 10 + 10)
            // eslint-disable-next-line array-callback-return
            .map((reminder) => {
              embed.addField(`\`${reminder.id}\` [<t:${(reminder.timeout / 1000).toFixed()}>]:`, `Сообщение: **${reminder.details.message}**`);
            });
          entries.push(new PaginatorEntry(null, embed));
        }
        await new PaginatorUtil(message.client, message.author, entries).init(message.channel, 150);
        break;
      default:
        return getHelp(message, this.name);
    }
  }
}

module.exports = ReminderCommand;
