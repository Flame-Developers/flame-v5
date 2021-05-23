/* eslint-disable */

const { Collection } = require('discord.js');
const { permissions } = require('../utils/Constants');
const { premiumRequired } = require('../utils/Errors');

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
    if (this.message.author.bot) return;

    const data = await this.client.database.collection('guilds').findOne({ guildID: this.message.guild?.id });
    if (!this.message.content.startsWith(data?.prefix)) return;

    const [cmd, ...args] = this.message.content.slice(data.prefix.length).trim().split(/ +/g);
    const command = await this.findCommand(cmd);

    if (cooldown.has(this.message.author.id) && cooldown.get(this.message.author.id) === command?.name) return this.message.react('⏱️').catch();
    if (command) {
      if (data.disabledCommands?.includes(command.name)) {
        return data?.settings?.answerOnDisabledCommands
          ? this.message.reply('Данная команда была отключена администратором на данном сервере :no_entry:')
          : null;
      }
      if (!this.message.guild.me.permissionsIn(this.message.channel).has('EMBED_LINKS')) return this.message.reply(`Упс, кажется, что у меня нет прав на встраивание ссылок в данном канале. Выдайте мне пожалуйста данную возможность, иначе я не смогу корректно работать и выполнять команды :no_entry:`);
      if (command.premium && !await this.message.guild.hasPremium()) return premiumRequired(this.message);

      if (command.clientPermissions.length > 0 && command.clientPermissions.some((permission) => !this.message.guild.me.permissions.has(permission))) return this.message.reply(`У меня недостаточно прав для выполнения данного действия. Необходимые права: ${command.clientPermissions.map((r) => `\`${permissions[r]}\``).join(', ')} :no_entry:`);
      if ((command.userPermissions.length > 0 && command.userPermissions.some((permission) => !this.message.member.permissions.has(permission))) && !this.message.member.roles.cache.has(data?.moderator)) return this.message.reply(`У вас недостаточно прав для выполнения данного действия. Необходимые права: ${command.userPermissions.map((r) => `\`${permissions[r]}\``).join(', ')} :no_entry:`);

      try {
        command.run(this.message, args);
        if (data?.settings?.clearCommandCalls) await this.message.delete().catch();
      } catch (error) {
        this.client.emit('commandError', error, this.message);
      }

      if (!await this.message.guild.hasPremium()) {
        cooldown.set(this.message.author.id, command.name);
        setTimeout(() => cooldown.delete(this.message.author.id), command.cooldown * 1000);
      }
    }
  }
}

module.exports = CommandsExecutorService;
