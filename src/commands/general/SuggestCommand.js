const { MessageEmbed } = require('discord.js');
const ActionConfirmationUtil = require('../../utils/misc/ActionConfirmationUtil');
const InteractionResponse = require('../../utils/interactions/InteractionResponse');
const FlameCommand = require('../../structures/FlameCommand');
const { getHelp } = require('../../utils/Functions');

class SuggestCommand extends FlameCommand {
  constructor() {
    super('suggest', {
      description: 'Отправить предложение для сервера.',
      category: 'general',
      usage: 'suggest <Предложение>',
      aliases: [],
      examples: [
        'f.suggest Добавить возможность выбора языка при входе на сервер.',
      ],
      cooldown: 3,
    });
  }

  get #buttons() {
    return [
      {
        type: 2,
        style: 4,
        custom_id: 'delete',
        label: 'Удалить предложение',
      }
    ];
  }

  async run(message, args) {
    const data = await message.client.database.collection('guilds').findOne({ guildID: message.guild.id });
    if (!data.ideaChannel) return message.fail('На данном сервере не установлен канал для предложений. Обратитесь к администратору для решения данной проблемы.');
    if (data.ideaBlacklist?.includes(message.author.id)) return message.fail('Вы не можете использовать данную команду, так как находитесь в черном списке предложений данного сервера.');

    const suggestion = args.join(' ');

    if (!suggestion) return getHelp(message, this.name);
    if (suggestion.length > 1850) return message.fail('Длина предложения не должна превышать лимит в **1850** символов.');
    if (!message.guild.me.permissionsIn(data.ideaChannel).has('SEND_MESSAGES')) return message.fail('У меня нет прав на отправку сообщений в текущий канал предложений на сервере.');

    await new ActionConfirmationUtil(message.client, message.author).init('Вы уверены, что хотите отправить свое предложение? У вас есть **30** секунд на решение.', message.channel).then(async (response) => {
      if (response) {
        const id = (data.ideas?.length ?? 0) + 1;
        const m = await message.client.api.channels(data.ideaChannel).messages.post({
          data: {
            content: null,
            embed: new MessageEmbed()
              .setTitle(`Предложение №${id}`)
              .setDescription(suggestion)
              .addField(`Дополнительные сведения:`, `Автор: **${message.author.tag}** (${message.author.id})\nДата отправки: **${new Date().toLocaleString('ru')}**`)
              .setColor('ffa500')
              .setFooter(message.guild.name, message.guild.iconURL())
              .setTimestamp().toJSON(),
            components: [
              {
                type: 1,
                components: this.#buttons,
              },
            ],
          },
        });
        ['👍', '👎'].forEach((r) => message.guild.channels.cache.get(data.ideaChannel).messages.cache.get(m.id).react(r));
        message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
          $push: {
            ideas: {
              id,
              message: m.id,
            },
          },
        });
        message.client.cache.buttons.set(m.id, async (res) => {
          switch (res.data.custom_id) {
            case 'delete':
              if (res.member.permissions.has('MANAGE_GUILD') || res.member.id === message.author.id) {
                message.client.database.collection('guilds').updateOne({ guildID: message.guild.id }, {
                  $pull: {
                    ideas: { id },
                  },
                });
                await message.client.api.channels(data.ideaChannel).messages(m.id).delete().catch(null);
              } else return new InteractionResponse(message.client).send(res, 'Вы не можете удалять предложения других пользователей, поскольку не являетесь модератором данного сервера.', { flags: 64 });
              break;
            default:
          }
        });
        return message.channel.send(`${message.client.constants.emojis.DONE} Ваше предложение было успешно доставлено в канал <#${data.ideaChannel}> (ID: **${id}**)`);
      } else message.fail('Процесс отправки предложения был отменен.');
    });
  }
}

module.exports = SuggestCommand;
