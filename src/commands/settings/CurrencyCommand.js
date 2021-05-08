const { MessageEmbed } = require('discord.js');
const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class CurrencyCommand extends FlameCommand {
  constructor() {
    super('currency', {
      description: 'Установить символ валюты сервера (касательно экономики).',
      category: 'settings',
      aliases: [],
      usage: 'currency set <Символ>',
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });

    if (args[0] === 'set') {
      if (!args[1]) return getHelp(message, this.name);
      if (args[1].length > 30) return message.reply('Длинна символа валюты не должна превышать лимит в **30** символов :no_entry:');

      message.client.database.collection('guilds').updateOne({guildID: message.guild.id}, {
        $set: {
          currency: args[1],
        },
      });
      return message.channel.send(`✅ Символ валюты был успешно установлен на **${args[1]}**.`);
    }
    message.channel.send(`Символ валюты на данном сервере установлен на **${data.currency}**.\nВы в любой момент можете изменить его воспользовавшись командой \`${data.prefix}currency set\`.`);
  }
}

module.exports = CurrencyCommand;