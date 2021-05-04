const Discord = require('discord.js');
const FlameCommand = require('../structures/FlameCommand');

class EvalCommand extends FlameCommand {
  constructor() {
    super('eval', {
      description: 'Команда, которая может выполнять код… а ты что думал?',
      usage: 'ALT+F4',
      aliases: ['e', '>'],
    });
  }

  async run(message, args) {
    // eslint-disable-next-line global-require
    const util = require('util');
    let code = args.join(' '); let
      isAsync = false;

    if (message.author.id === '525003205394825257') {
      try {
        if (!code) return message.reply('Введите код для выполнения.');
        code = code.replace(/(```(.+)?)?/g, '');

        if (code.includes('await')) isAsync = true;
        if (isAsync) code = `(async () => {${code}})()`;

        const before = process.hrtime.bigint();
        // eslint-disable-next-line
        let executed = eval(code);

        if (util.types.isPromise(executed)) executed = await executed;
        const after = process.hrtime.bigint();

        if (typeof executed !== 'string') executed = util.inspect(executed);
        if (['undefined', 'null'].includes(executed)) executed = `Empty response: ${executed}`;

        if (executed.length >= 1940) {
          message.channel.send('⚠️ Результат оказался слишком большим, поэтому я отправил его тебе в личку.');
          return message.member.send(executed, { split: '\n', code: 'js' });
        }

        executed = `Выполнено за ${(parseInt(after - before) / 1000000).toFixed(3)} миллисекунд.\n${executed}`;
        // eslint-disable-next-line no-use-before-define
        message.reply(`\`\`\`js\n${clean(executed)}\`\`\``);
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
