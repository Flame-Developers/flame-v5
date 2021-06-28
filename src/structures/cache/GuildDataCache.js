class GuildDataCache {
  constructor(data = null) {
    this.prefix = data?.prefix ?? 'f.';
    this.premium = data?.premium ?? null;
    this.moderator = data?.moderator ?? null;
    this.disabledCommands = data?.disabledCommands ?? [];
    this.settings = data?.settings ?? {};
  }

  set(prop, val) {
    // eslint-disable-next-line no-return-assign
    return this[prop] = val;
  }

  push(arr, el) {
    if (!Array.isArray(this[arr])) throw new TypeError(`You can push data only to arrays.`);
    return this[arr].push(el);
  }
}

module.exports = GuildDataCache;
