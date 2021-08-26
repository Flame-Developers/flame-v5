const { getHelp } = require('../../utils/Functions');
const FlameCommand = require('../../structures/FlameCommand');

class SuggestionsCommand extends FlameCommand {
  constructor() {
    super('suggestions', {
      description: 'Конфигурация системы предложений.',
      category: 'settings',
      usage: 'suggestions [channel/blacklist]',
      aliases: [],
      userPermissions: ['MANAGE_GUILD'],
    });
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    const option = args[0];

    switch (option) {
      case 'channel':
        // eslint-disable-next-line max-len
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

        if (!channel) {
          message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
            $set: {
              ideaChannel: null,
            },
          });
          return message.channel.send(`${message.client.constants.emojis.DONE} Канал для предложений был успешно сброшен на данном сервере.`);
        }
        if (!message.guild.channels.cache.has(channel.id)) return message.fail('Указанного вами канала не существует на данном сервере.');
        if (channel.type !== 'text') return message.fail('Канал данного типа не поддерживается.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $set: {
            ideaChannel: channel.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Канал предложений был успешно установлен на ${channel} (${channel.id}).`);
        break;
      case 'blacklist':
        const user = message.mentions.members.first() || message.guild.channels.cache.get(args[1]);
        if (!user) return message.fail('Укажите пожалуйста пользователя, которого вы хотите занести в черный список.');
        if (user.permissions.has('MANAGE_GUILD') || user.roles.highest.position >= message.member.roles.highest.position) return message.fail('Вы не можете внести данного пользователя в черный список, так как он имеет равные вам права.');

        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          [data.ideaBlacklist?.includes(user.id) ? '$pull' : '$push']: {
            ideaBlacklist: user.id,
          },
        });
        message.channel.send(`${message.client.constants.emojis.DONE} Пользователь **${user.id}** был успешно ${!data.ideaBlacklist?.includes(user.id) ? 'внесен в черный список.' : 'вынесен из черного списка.'}`);
        break;
      default:
        return getHelp(message, this.name);
    }
  }
}

module.exports = SuggestionsCommand;
