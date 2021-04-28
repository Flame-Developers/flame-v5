class FlameListener {
  constructor(name, options = {}) {
    this.name = name;
    this.ws = options.ws || false;
    this.event = options.event || null;
  }
}

module.exports = FlameListener;
