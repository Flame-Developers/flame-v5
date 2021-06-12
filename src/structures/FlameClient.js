/* eslint-disable global-require,no-console */
const { Client, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');

const LoaderService = require('../services/LoaderService');
const CachingService = require('../services/CachingService');
const FlamePlayer = require('./FlamePlayer');
const FlameQueue = require('./FlameQueue');

class FlameClient extends Client {
  constructor(options) {
    super(options);
    this.config = require('../../config.json');

    this.mongo = new MongoClient(this.config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.cache = this.config.cachingEnabled ? new CachingService() : null;
    this.constants = require('../utils/Constants');

    this.shoukaku = new FlamePlayer(this);
    this.queue = new FlameQueue(this);
    this.listeners = new Collection();
    this.commands = new Collection();
    this.interactions = new Collection();

    this.buttonCache = new Map();
  }

  get database() {
    return this.mongo.db('<dbname>');
  }

  async _launch() {
    await this.mongo.connect();
    await LoaderService.loadListeners(this, '../listeners');
    await LoaderService.loadCommands(this, '../commands');
    await LoaderService.loadInteractions(this, '../interactions/');
    return this.login(this.config.token).catch(console.error);
  }
}

module.exports = FlameClient;
