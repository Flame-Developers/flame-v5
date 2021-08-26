/* eslint-disable */

const { MessageEmbed, Collection } = require('discord.js');
const Errors = require('../utils/Errors');
const GuildDataCache = require('../structures/cache/GuildDataCache');

const cooldown = new Collection();

class CommandsExecutorService {
  constructor(message, client) {
    this.message = message;
    this.client = client || message.client;
  }
  findCommand(commandName) {
    const command = this.client?.commands.get(commandName);
    if (command) {
      return command;

    } else return this.client?.commands.find((c) => c?.aliases.includes(commandName));
  }
  async runCommand() {
    if (!this.message.guild?.cache) {
      const data = await this.client.database.collection('guilds').findOne({ guildID: this.message.guild.id });
      this.message.guild.cache = new GuildDataCache(data);
    }
    const guild = this.message.guild.cache;

    if (!this.message.content.startsWith(guild.prefix)) return;

    const [cmd, ...args] = this.message.content.slice(guild.prefix.length).trim().split(/ +/g);
    const command = await this.findCommand(cmd);

    if (cooldown.has(this.message.author.id) && cooldown.get(this.message.author.id) === command?.name) return this.message.react('⏱️').catch();

    if (command) {
      if (guild.disabledCommands?.includes(command.name)) {
        return guild.settings?.answerOnDisabledCommands
          ? this.message.fail('Данная команда была отключена администратором на данном сервере.')
          : null;
      }
      if (!this.message.guild.me.permissionsIn(this.message.channel).has('EMBED_LINKS')) return this.message.fail(`Упс, кажется, что у меня нет прав на встраивание ссылок в данном канале. Выдайте мне пожалуйста данную возможность, иначе я не смогу корректно работать и выполнять команды.`);
      if (command.premium && !guild.premium) return Errors.premiumRequired(this.message);

      if (command.clientPermissions.length > 0 && command.clientPermissions.some((permission) => !this.message.guild.me.permissions.has(permission)))
        return this.message.fail(`Похоже, что для выполнения данной команды боту нужны дополнительные права. Выдайте ему их, прежде чем заново использовать команду.\nДля стабильной работы всего функционала рекомендуется выдать право администратора сервера.`);
      if (
        (command.userPermissions.length > 0 && command.userPermissions.some((permission) => !this.message.member.permissions.has(permission)))
        && (!this.message.member.roles.cache.has(guild.moderator) || command.category !== 'moderation')
      ) return Errors.missingPermissions(this.message, command.userPermissions);
      
      if (['help', '?'].includes(args[0])) return this.client.utils.getHelp(this.message, command.name);
      try {
        await command.run(this.message, args);
        if (guild.settings?.clearCommandCalls) await this.message.delete().catch();
      } catch (error) {
        await this.message.react(this.client.constants.emojis.FAIL);
        this.message.reply(
          new MessageEmbed()
            .setTitle('Упс, что-то пошло не так…')
            .setDescription(
              'При выполнении данной команды возникла неизвестная программная ошибка. Попробуйте пожалуйста позже, или обратитесь на сервер поддержки.\n'
              + `\`\`\`js\n${error}\`\`\``,
            )
            .setColor('#ff3333')
            .setFooter(this.message.guild.name, this.message.guild.iconURL())
            .setTimestamp(),
        );
        console.error(error);
      }
      cooldown.set(this.message.author.id, command.name);
      setTimeout(() => cooldown.delete(this.message.author.id), guild.premium ? 1000 : command.cooldown * 1000);
    }
  }
}

module.exports = CommandsExecutorService;
