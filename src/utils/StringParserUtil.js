class StringParserUtil {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static parse(string, keys = {}) {
    const match = string.match(/\{{ [a-z]+ }}/g);

    if (match) {
      // eslint-disable-next-line no-restricted-syntax
      for (const m of match) {
        const key = keys[m.match(/[a-z]+/g)];

        if (!key) continue;
        if (typeof key === 'function') throw new Error('Unsupported key type.');

        // eslint-disable-next-line no-param-reassign
        string = string.replace(m, keys[m.match(/[a-z]+/g)]);
      }
    }

    return string;
  }
}

module.exports = StringParserUtil;
