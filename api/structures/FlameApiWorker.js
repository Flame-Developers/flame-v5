const fastify = require('fastify')();
const Logger = require('../../src/utils/misc/Logger');

class FlameApiWorker {
  constructor(manager) {
    this.manager = manager;
    this.app = fastify;
    this.config = require('../../config.json');
  }

  start() {
    this.app.register(require('fastify-cors'), { origin: true });
    this.app.register(require('fastify-rate-limit'), {
      max: 100,
      timeWindow: 3 * 60 * 1000,
      cache: 5000,
      addHeaders: {
        'x-ratelimit-limit': true,
        'x-ratelimit-reset': true,
        'x-ratelimit-remaining': true,
        'retry-after': true,
      },
      keyGenerator: (req) => req.headers['cf-connecting-ip'],
    });
    this.app.setErrorHandler((error, request, response) => {
      switch (response.statusCode) {
        case 429:
          error.message = 'You are being ratelimited, try again in a couple of minutes.';
          break;
      }
      response.send(error);
    });

    global.ApiWorker = this;

    require('../routes').forEach((route) => this.app.route(route));
    this.app.listen(this.config.port || 3099, '0.0.0.0').catch();

    return Logger.info(`HTTP-server was successfully started on port ${this.config.port || 3099}.`);
  }
}

module.exports = FlameApiWorker;
