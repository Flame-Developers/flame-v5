const FlameInteraction = require('../structures/FlameInteraction');

class TestInteraction extends FlameInteraction {
  constructor() {
    super('ping');
  }
  run(client, interaction) {
    return client.api
      .interactions(interaction.id, interaction.token)
      .callback.post({
        data: {
          type: 4,
          data: {
            content:
              ':ping_pong: Понг! Если ты читаешь это, то все идеально работает.',
          },
        },
      });
  }
}

module.exports = TestInteraction;
