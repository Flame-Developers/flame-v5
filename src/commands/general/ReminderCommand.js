const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const FlameCommand = require('../../structures/FlameCommand');
const ReminderManager = require('../../managers/ReminderManager');

class ReminderCommand extends FlameCommand {
  constructor() {
    super('reminder', {
      description: 'Управление вашими напоминаниями.',
      category: 'general',
      usage: 'reminder <create/remove/list>',
      aliases: [],
    });
  }

  async run(message, args) {
    const option = args[0];
    const Reminders = new ReminderManager(message.client);

    switch (option) {
      case 'create':
        const time = args[1];
        if (!time) {
          return message.reply(
            'Укажите пожалуйста длительность напоминания :no_entry:',
          );
        }
        if (!ms(time) || ms(time) > ms('14d') || ms(time) < ms('1m')) {
          return message.reply(
            'Длительность напоминания должна быть от одной минуты до 14-ти дней :no_entry:',
          );
        }

        message.react('✅');
        await Reminders.handle(
          {
            userID: message.author.id,
            id: Math.random().toString(36).slice(2, 8),
            timeout: Date.now() + ms(time),
            details: {
              message:
                args.slice(2).join(' ').slice(0, 1799)
                || 'Вы создали напоминание, но забыли указать сообщение. Потрясающий ход!',
            },
          },
        );
        break;
      case 'remove':
        if (!args[1]) {
          return message.reply(
            'Укажите пожалуйста ID напоминания которое вы хотите удалить :no_entry:',
          );
        }
        if (!(await Reminders.find({ userID: message.author.id, id: args[1] }))) {
          return message.reply(
            'Указанного вами напоминания не существует :no_entry:',
          );
        }

        Reminders.delete({ userID: message.author.id, id: args[1] });
        message.reply('✅ Напоминание с указанным ID было успешно удалено.');
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
              `Напоминание \`${i.id}\`: ${new Date(i.timeout)
                .toISOString()
                .replace('T', ' ')
                .substr(0, 19)}:`,
              `**Сообщение:** ${i.details.message}`,
            );
          }
        }
        message.channel.send(embed);
        break;
    }
  }
}

module.exports = ReminderCommand;
