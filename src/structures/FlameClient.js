const { Client, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');

const loadListeners = require('../helpers/loadListeners');
const loadCommands = require('../helpers/loadCommands');
const loadInteractions = require('../helpers/loadInteractions');

const CachingService = require('../services/CachingService');
const FlameMusicClient = require('./music/ShoukakuClient');
const FlameQueue = require('./FlameQueue');

class FlameClient extends Client {
  constructor(options) {
    super(options);
    this.config = require('../../config.json');

    this.mongo = new MongoClient(this.config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.redis = this.config.cachingEnabled ? new CachingService() : null;
    this.cache = {
      buttons: new Map(),
      rob: [],
    };
    this.constants = require('../utils/Constants');
    this.utils = require('../utils/Functions');

    this.shoukaku = new FlameMusicClient(this);
    this.queue = new FlameQueue(this);
    this.listeners = new Collection();
    this.commands = new Collection();
    this.interactions = new Collection();
    this.players = new Collection();
  }

  get database() {
    return this.mongo.db('<dbname>');
  }

  async _launch() {
    await this.mongo.connect();
    await loadListeners(this, '../listeners');
    await loadCommands(this, '../commands');
    await loadInteractions(this, '../interactions/');
    return this.login(this.config.token).catch(console.error);
  }
}

module.exports = FlameClient;
