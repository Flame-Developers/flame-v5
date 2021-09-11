class FlameInteraction {
  constructor(name, options = {}) {
    this.name = name;
    this.category = options.category || 'music';
    /* Currently, only music is based on slash commands.
       This can change any time.
     */
    this.djOnly = options.djOnly || true;
    this.premium = options.premium || false;
    this.active = options.active || true;
  }
}

module.exports = FlameInteraction;
