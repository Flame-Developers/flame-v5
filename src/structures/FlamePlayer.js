const { Shoukaku } = require('shoukaku');
const config = require('../../config.json');

const nodes = [
  {
    name: config.lavalink.name,
    host: config.lavalink.host,
    port: config.lavalink.port,
    auth: config.lavalink.auth,
  },
];
const options = {
  moveOnDisconnect: false,
  resumable: true,
  resumableTimeout: 30,
  reconnectTries: 10,
  restTimeout: 10000,
};

class FlamePlayer extends Shoukaku {
  constructor(client) {
    super(client, nodes, options);

    this.on('ready', (name, resumed) => console.log(`[Lavalink => ${name}] ${resumed ? 'Reconnected' : 'Connected'}.`));
    this.on('error', (error) => console.error(error));
    this.on('close', (name, code) => console.log(`[Lavalink => ${name}] Connection closed with code ${code}.`));
    this.on('disconnected', (name) => console.log(`[Lavalink => ${name}] Disconnected.`));
  }
}

module.exports = FlamePlayer;
