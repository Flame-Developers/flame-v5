class StringParserUtil {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  static parse(string, keys = {}) {
    const match = string.match(/{{?[a-z]?.+?}}/g);

    if (match) {
      // eslint-disable-next-line no-restricted-syntax
      for (const m of match) {
        const key = keys[m.match(/[A-Za-z]+.?[A-Za-z]+/g)];
        if (!key) continue;
        if (typeof key === 'function') throw new Error('Unsupported key type.');

        // eslint-disable-next-line no-param-reassign
        string = string.replace(m, keys[m.match(/[A-Za-z]+.?[A-Za-z]+/g)]);
      }
    }

    return string;
  }

  static parseInvites(string) {
    const InviteRegex = /(?:https?:\/\/)?(?:www\.)?discord(?:\.(?:gg|io|me|li)|(?:app)?\.com\/invite)\/(?<invite_code>\w{2,})\/?/gm;
    const match = string.match(InviteRegex);

    if (match) {
      return { inviteLinks: match, inviteCode: InviteRegex.exec(string).groups?.invite_code };
    }
    return null;
  }

  static parseFlags(string) {
    return string.match(/--[a-z]+/g);
  }
}

module.exports = StringParserUtil;
