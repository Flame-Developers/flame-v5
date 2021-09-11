const { Shoukaku } = require('shoukaku');
const Logger = require('../../utils/misc/Logger');
const nodes = require('../../../config.json').musicNodes;

class ShoukakuClient extends Shoukaku {
  constructor(client) {
    super(client, nodes, {
      moveOnDisconnect: nodes.length > 1,
      resumable: true,
      resumableTimeout: 60,
      reconnectTries: 3,
      restTimeout: 20000,
    });
    Logger.info(`Loaded ${nodes.length} music nodes.`);

    this.on('ready', (name, resumed) => Logger.info(`${name} ${resumed ? 'reconnected' : 'connected'}.`));
    this.on('error', (name) => Logger.error(`${name} returned an error while trying to interact with it.`));
    this.on('close', (name, code) => Logger.warn(`${name} closed connection with code ${code}.`));
    this.on('disconnected', (name) => Logger.warn(`${name} disconnected.`));
  }
}

module.exports = ShoukakuClient;
