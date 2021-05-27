const { Shoukaku } = require('shoukaku');
const config = require('../../config.json');
const Logger = require('../utils/Logger')

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
  reconnectTries: 1,
  restTimeout: 10000,
};

class FlamePlayer extends Shoukaku {
  constructor(client) {
    super(client, nodes, options);
    this.on('ready', (name, resumed) => Logger.info(`${name} ${resumed ? 'reconnected' : 'reconnected'}.`));
    this.on('error', (name) => Logger.error(`${name} returned an error while trying to interact with it.`));
    this.on('close', (name, code) => Logger.warn(`${name} closed connection with code ${code}.`));
    this.on('disconnected', (name) => Logger.warn(`${name} disconnected.`));
  }
}

module.exports = FlamePlayer;
