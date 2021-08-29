const { MessageEmbed } = require('discord.js');
const Constants = require('./Constants');

module.exports = {
  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },
  randomize(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  percentage(percent, whole) {
    return parseInt((percent * whole) / 100.0);
  },
  timeout(duration = 0) {
    return require('moment').utc(Math.abs(duration)).format('HH:mm:ss');
  },
  locale(n, text, isMs = false) {
    if (isMs) n = ~~(n / 1000);
    // eslint-disable-next-line
    return `${n} ${text[ n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2 ]}`;
  },
  getHelp(message, cmd) {
    const command = message.client.commands.get(cmd);
    if (!command || !command?.category || command?.category === 'developers') return 'Cannot display anything about this command.';

    return message.channel.send(
      `:information_source: Информация о команде \`${command.name}\`:`,
      new MessageEmbed()
        .setTitle(command.description)
        .setThumbnail(message.client.user.avatarURL({ size: 2048 }))
        .setColor('ffa500')
        .setDescription(
          `:star: Бонусная команда: ${command.premium ? 'Да' : 'Нет'}\n`
          + `**Задержка:** ${module.exports.locale(command.cooldown, ['секунда', 'секунды', 'секунд'])}\n`
          + `**Псевдонимы:** ${command.aliases.length ? command.aliases.join(', ') : 'Отсутствуют'}\n`
          + `**Необходимые права:** ${command.userPermissions.length ? command.userPermissions.map((p) => Constants.permissions[p]).join(', ') : '-'}\n\n`
          + `> Использование: \`${command.usage}\`\n`,
        )
        .addField('__Полезные примеры__', command.examples.length ? command.examples.join('\n') : 'Примеры использования команды отсутствуют.')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
  },
};
