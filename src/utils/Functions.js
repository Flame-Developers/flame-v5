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
      `<:information:883702413427634287> Информация о команде \`${command.name}\`:\n`
      + `> ${command.description}\n\n`
      + `:star: Бонусная команда? **${command.premium ? 'Да' : 'Нет'}**\n`
      + `Задержка: ${module.exports.locale(command.cooldown, ['секунда', 'секунды', 'секунд'])}\n`
      + `Псевдонимы: ${command.aliases.length ? command.aliases.map((a) => `\`${a}\``).join(', ') : 'Отсутствуют'}\n`
      + `Необходимые права:\n  - <:user:885969192619245598> Пользователь: ${command.userPermissions.length ? command.userPermissions.map((p) => `**${Constants.permissions[p]}**`).join(', ') : 'Команда доступна всем пользователям.'}\n  - <:bot:885969270134173718> Бот: ${command.clientPermissions.length ? command.clientPermissions.map((p) => `**${Constants.permissions[p]}**`).join(', ') : 'Команда доступна при стандартных правах.'}\n\n`
      + `__Использование:__ \`${command.usage}\`\n`
      + `${command.examples.length ? command.examples.map((e) => `┗ ${e}`).join('\n') : ''}`,
    );
  },
};
