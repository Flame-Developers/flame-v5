class StringParserUtil {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }
  static parse(string, keys = {}) {
    const match = string.match(/\{{ [a-z]+ }}/g);

    if (match) {
      for (const m of match) {
        let key = keys[m.match(/[a-z]+/g)];

        if (!key) continue;
        if (typeof key === 'function') throw new Error('Unsupported key type.');

        string = string.replace(m, keys[m.match(/[a-z]+/g)]);
      }
    }

    return string;
  }
}

module.exports = StringParserUtil;
