const { MessageEmbed } = require('discord.js');

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
};
