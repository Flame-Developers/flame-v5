/* eslint-disable no-case-declarations */
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
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
        'f.reminder remove j8vofc',
      ],
    });
  }

  async run(message, args) {
    const option = args[0];
    const Reminders = new ReminderManager(message.client);

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

        const date = new Date(Date.now() + ms(time)).toLocaleString('ru');
        const id = Reminders.generateID();

        await message.react('✅');
        await Reminders.handle(
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
        message.channel.send(`${message.client.constants.emojis.DONE} Я напомню вам об этом \`${date}\` (ID напоминания: \`${id}\`)`);
        break;
      case 'remove':
        if (!args[1]) {
          return message.fail(
            'Укажите пожалуйста ID напоминания которое вы хотите удалить.',
          );
        }
        if (!(await Reminders.find({ userID: message.author.id, id: args[1] }))) {
          return message.fail(
            'Указанного вами напоминания не существует.',
          );
        }

        Reminders.delete({ userID: message.author.id, id: args[1] });
        message.reply(`${message.client.constants.emojis.DONE} Напоминание было успешно удалено.`);
        break;
      case 'list':
        const data = await message.client.database
          .collection('reminders')
          .find({ userID: message.author.id })
          .toArray();
        const embed = new MessageEmbed()
          .setTitle('Список напоминаний')
          .setColor('ffa500')
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();

        if (!data.length) {
          embed.setDescription(
            'На данный момент вы не имеете активных напоминаний. Создайте себе парочку!',
          );
        } else {
          embed.setThumbnail(message.guild.iconURL());
          for (const i of data.slice(-10)) {
            embed.addField(
              `Напоминание \`${i.id}\`: ${new Date(i.timeout).toLocaleString('ru')}:`,
              `**Сообщение:** ${i.details.message}`,
            );
          }
        }
        message.channel.send(embed);
        break;
      default:
        return getHelp(message, this.name);
    }
  }
}

module.exports = ReminderCommand;
