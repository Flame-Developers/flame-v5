const { MessageEmbed } = require('discord.js');
const { permissions } = require('./Constants');

module.exports = {
  premiumRequired(message) {
    return message.channel.send(
      new MessageEmbed()
        .setTitle('Вы наткнулись на бонусную возможность!')
        .setDescription('К сожалению, данная возможность доступна только за поддержку нашего проекта. Посетите [данную страницу](https://flamebot.ru/donate) для дополнительной информации.\n\nЕсли вы уже поддержали нас, то воспользуйтесь командой `bonus` для активации бонусных-возможностей на данном сервере.')
        .setColor('ffa550')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp(),
    );
  },
  missingPermissions(message, requiredPermissions = []) {
    const embed = new MessageEmbed()
      .setTitle('⚠️ Недостаточно прав')
      .setDescription('Похоже, данная команда требует прав, которых вы не имеете. Обратитесь на сервер поддержки, если считаете, что видите это сообщение по ошибке.')
      .setColor('ff3333')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

    if (requiredPermissions.length) embed.addField('Необходимые права:', requiredPermissions.map((p) => permissions[p]).join('\n'));
    return message.channel.send(embed);
  },
};
