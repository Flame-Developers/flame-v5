/* eslint-disable */

const { MessageEmbed, Collection } = require('discord.js');
const { permissions } = require('../utils/Constants');
const { premiumRequired } = require('../utils/Errors');

const cooldown = new Collection();
const executions = new Map();

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
    if (this.message.author.bot) return;

    const data = await this.client.database.collection('guilds').findOne({ guildID: this.message.guild?.id });
    if (!this.message.content.startsWith(data?.prefix)) return;

    const [cmd, ...args] = this.message.content.slice(data.prefix.length).trim().split(/ +/g);
    const command = await this.findCommand(cmd);

    if (cooldown.has(this.message.author.id) && cooldown.get(this.message.author.id) === command?.name) return this.message.react('⏱️').catch();
    if (executions.has(this.message.author.id)) return this.message.react('<a:processing:853669211028324402>').catch();

    if (command) {
      executions.set(this.message.author.id, true);
      if (data.disabledCommands?.includes(command.name)) {
        return data?.settings?.answerOnDisabledCommands
          ? this.message.fail('Данная команда была отключена администратором на данном сервере.')
          : null;
      }
      if (!this.message.guild.me.permissionsIn(this.message.channel).has('EMBED_LINKS')) return this.message.fail(`Упс, кажется, что у меня нет прав на встраивание ссылок в данном канале. Выдайте мне пожалуйста данную возможность, иначе я не смогу корректно работать и выполнять команды.`);
      if (command.premium && !await this.message.guild.hasPremium()) return premiumRequired(this.message);

      if (command.clientPermissions.length > 0 && command.clientPermissions.some((permission) => !this.message.guild.me.permissions.has(permission))) return this.message.fail(`У меня недостаточно прав для выполнения данного действия. Необходимые права: ${command.clientPermissions.map((r) => `\`${permissions[r]}\``).join(', ')}.`);
      if ((command.userPermissions.length > 0 && command.userPermissions.some((permission) => !this.message.member.permissions.has(permission))) && !this.message.member.roles.cache.has(data?.moderator)) return this.message.fail(`У вас недостаточно прав для выполнения данного действия. Необходимые права: ${command.userPermissions.map((r) => `\`${permissions[r]}\``).join(', ')}.`);

      try {
        await command.run(this.message, args);
        if (data?.settings?.clearCommandCalls) await this.message.delete().catch();
      } catch (error) {
        this.message.reply(
          new MessageEmbed()
            .setTitle('Упс, что-то пошло не так…')
            .setDescription(
              'При выполнении данной команды возникла ошибка. Попробуйте пожалуйста позже, или обратитесь на сервер поддержки.',
            )
            .setColor('#ff3333')
            .setFooter(this.message.guild.name, this.message.guild.iconURL())
            .setTimestamp(),
        )
        console.error(error);
      }
      executions.delete(this.message.author.id);

      if (!await this.message.guild.hasPremium() || command.name === 'reset-economy') {
        cooldown.set(this.message.author.id, command.name);
        setTimeout(() => cooldown.delete(this.message.author.id), command.cooldown * 1000);
      }
    }
  }
}

module.exports = CommandsExecutorService;
