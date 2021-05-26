const Discord = require('discord.js');
const config = require('../../config.json');

const hook = new Discord.WebhookClient(
  config.emergency.split('/')[5],
  config.emergency.split('/')[6],
);

class ReportService {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static sendReport() {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.from(arguments);

    if (!args.length) throw new Error('Missing required arguments.');
    if (args.some((a) => typeof a === 'string' && a.length >= 2000)) {
      throw new Error(
        'Arguments with type "string" cannot contain more than 2000 characters.',
      );
    }
    return hook.send(...args);
  }
}

module.exports = ReportService;
