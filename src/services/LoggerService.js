const Discord = require('discord.js');
const config = require('../../config.json');

const hook = new Discord.WebhookClient(
  config.emergency.split('/')[5],
  config.emergency.split('/')[6],
);

class LoggerService {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static sendLog(data) {
    if (!data) throw new Error('Missing required arguments.');
    if (data.length >= 2000) {
      throw new Error(
        'Argument "data" cannot contain more than 2000 characters.',
      );
    }

    hook.send(data, { allowedMentions: null });
    return true;
  }

  static reportError(error) {
    if (!error) throw new Error('Missing required arguments.');

    hook.send(
      new Discord.MessageEmbed()
        .setTitle(error ?? 'Неизвестная ошибка')
        .setDescription(
          error?.stack
            ? `Дополнительные сведения: \`\`\`js\n${error.stack}\`\`\``
            : 'Информация отсутствует.',
        )
        .setColor('ff3333')
        .setTimestamp(),
    );
    return true;
  }
}

module.exports = LoggerService;
