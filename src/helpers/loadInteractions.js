/* eslint-disable */
const path = require('path');
const fs = require('fs').promises;
const FlameInteraction = require('../structures/FlameInteraction');

module.exports = async function loadInteractions(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) {
      await loadInteractions(client, path.join(dir, file));
    }
    if (file.endsWith('.js')) {
      const Interaction = require(path.join(filePath, file));
      if (Interaction.prototype instanceof FlameInteraction) {
        const interaction = new Interaction();
        client.interactions.set(interaction.name, interaction);
      }
    }
  }
}
