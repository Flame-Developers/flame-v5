/* eslint-disable */
const chalk = require('chalk');
const messages = {
  info: chalk.black.bgBlue,
  fail: chalk.black.bgRed,
  warn: chalk.black.bgYellow,
};

class Logger {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static #clearLine() {
    return process.stdout.isTTY
      ? process.stdout.clearLine(0) && process.stdout.cursorTo(0)
      : null;
  }

  static log(type, ...args) {
    if (!(type in messages)) throw new TypeError('Unresolved type of message. Please choose something between "info", "fail" and "warning".');

    this.#clearLine();
    return process.stdout.write(
      messages[type](type.toUpperCase()) + ` [${new Date().toLocaleString('ru')}]: ${args.join(' ')}\n`
    )
  }

  static info(...args) {
    return this.log('info', ...args);
  }

  static error(...args) {
    return this.log('fail', ...args);
  }

  static warn(...args) {
    return this.log('warn', ...args);
  }
}

module.exports = Logger;