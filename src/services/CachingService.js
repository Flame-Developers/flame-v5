const Redis = require('redis');
const util = require('util');
const config = require('../../config.json');

class CachingService {
  constructor() {
    this.config = config.redis || null;
    this.connection = Redis.createClient({
      host: config.host,
      port: config.port,
    });

    this.setAsync = util.promisify(this.connection.set).bind(this.connection);
    this.delAsync = util.promisify(this.connection.del).bind(this.connection);
    this.getAsync = util.promisify(this.connection.get).bind(this.connection);
  }

  set(key, value) {
    if (value instanceof Object) value = JSON.stringify(value);
    else if (typeof value !== 'string') throw new Error('Unsupported value type. Only string, objects and arrays are allowed.');

    return this.setAsync(key, value);
  }

  delete(key) {
    return this.delAsync(key);
  }

  async get(key) {
    const data = await this.getAsync(key);
    let res;

    try {
      res = JSON.parse(data);
    } catch {
      res = {};
    }

    return res;
  }
}

module.exports = CachingService;
