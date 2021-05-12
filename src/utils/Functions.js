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
  randomize(min, max) {
    // eslint-disable-next-line no-param-reassign
    min = Math.ceil(min);
    // eslint-disable-next-line no-param-reassign
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
