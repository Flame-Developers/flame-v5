const FlameListener = require('../../structures/FlameListener');
const InteractionData = require('../../utils/interactions/InteractionData');

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
        if (client.interactions.has(interaction.data.name)) {
          return client.interactions
            .get(interaction.data.name)
            .run(client, new InteractionData(client, interaction));
        }
        break;
    }
  }
}

module.exports = InteractionCreateListener;
