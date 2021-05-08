const { MessageEmbed } = require('discord.js');

module.exports = {
  getHelp(message, command) {
    const cmd = message.client.commands.get(command);
    const categories = {
      general: 'Основное',
      moderation: 'Модерация',
      music: 'Музыка',
      economy: 'Экономика',
      settings: 'Настройки',
      leveling: 'Уровни',
    };

    if (!cmd || cmd.name === 'eval') return null;

    return message.channel.send(
      new MessageEmbed()
        .setTitle('Информация о команде')
        .setThumbnail(message.client.user.avatarURL())
        .setColor('ffa500')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp()
        .addField('📜 Описание', cmd.description)
        .addField('📁 Категория', categories[cmd.category], true)
        .addField('📎 Псевдонимы', cmd.aliases.length ? cmd.aliases.map((a) => `\`${a}\``) : 'Отсутствуют', true)
        .setDescription(`\`\`\`${cmd.usage}\`\`\``),
    );
  },
  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },
  timeFromNow(time) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        // eslint-disable-next-line no-param-reassign
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        // eslint-disable-next-line no-param-reassign
        time = +new Date();
    }
    const formats = [
      [50, 'секунд(-ы)', 1],
      [120, '1 минуту назад', 'спустя 1 минуту'],
      [3600, 'минут(-ы)', 60],
      [7200, '1 час назад', 'спустя 1 час'],
      [86400, 'часов', 3600],
      [604800, 'дней', 86400],
      [2419200, 'недель', 604800],
      [29030400, 'месяцев', 2419200],
      [2903040000, 'лет', 29030400],
    ];
    let seconds = (+new Date() - time) / 1000;
    let token = 'назад';
    let choice = 1;
    if (seconds === 0) return 'Только что';
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      // eslint-disable-next-line no-unused-expressions
      token = 'спустя';
      choice = 2;
    }
    let i = 0;
    let format;

    // eslint-disable-next-line no-cond-assign
    while (format = formats[i++]) {
      if (seconds < format[0]) {
        if (typeof format[2] === 'string') return format[choice];
        return `${Math.floor(seconds / format[2])} ${format[1]} ${token}`;
      }
    }
    return time;
  },
  msToTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (100060)) % 60);
    let hours = parseInt((duration / (100060 * 60)) % 24);

    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}` || 'Неизвестно';
  },
  locale(n, text, isMs = false) {
    if (isMs) n = ~~(n / 1000);
    // eslint-disable-next-line
    return `${n} ${text[ n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2 ]}`;
  },
};
