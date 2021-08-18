/* eslint-disable no-use-before-define */
const Discord = require('discord.js');
const util = require('util');
const FlameCommand = require('../structures/FlameCommand');

class EvalCommand extends FlameCommand {
  constructor() {
    super('eval', {
      description: 'Команда выполняющая код по запросу разработчика.',
      usage: 'eval [code]',
      aliases: ['e', '>'],
      category: null,
    });
  }

  async run(message, args) {
    let code = args.join(' ');

    if (message.client.config?.developers?.includes(message.author.id)) {
      try {
        if (!code) return message.reply('Необходим код для выполнения.');
        code = code.replace(/(```(.+)?)?/g, '');

        if (code.includes('await')) code = `(async () => {${code}})()`;

        const before = process.hrtime.bigint();
        // eslint-disable-next-line
        let executed = eval(code);

        if (util.types.isPromise(executed)) executed = await executed;
        const after = process.hrtime.bigint();

        if (typeof executed !== 'string') executed = util.inspect(executed, { depth: 0, maxArrayLength: null });
        if (['undefined', 'null'].includes(executed)) executed = `Empty execution result: ${executed}`;

        executed = `Выполнено за ${(parseInt(after - before) / 1000000).toFixed(3)} миллисекунд.\n${clean(executed)}`;

        if (executed.length >= 1940) {
          return message.channel.send(
            new Discord.MessageAttachment(Buffer.from(executed), 'result.txt'),
          );
        }

        message.reply(`\`\`\`js\n${executed}\`\`\``);
      } catch (error) {
        message.reply(`\`\`\`js\n${error}\`\`\``);
      }
    }
    function clean(text) {
      return text
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
  }
}

module.exports = EvalCommand;
