const FlameListener = require('../../structures/FlameListener');

class InteractionCreateListener extends FlameListener {
  constructor() {
    super('InteractionCreateListener', {
      ws: true,
      event: 'INTERACTION_CREATE',
    });
  }
  run(client, interaction) {
    switch (interaction.type) {
      case 2:
        if (client.interactions.has(interaction.data.name))
          return client.interactions
            .get(interaction.data.name)
            .run(client, interaction);
        break;
    }
  }
}

module.exports = InteractionCreateListener;
