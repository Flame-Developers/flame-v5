const FlameInteraction = require('../structures/FlameInteraction');
const InteractionResponse = require('../utils/interactions/InteractionResponse');

class DjInteraction extends FlameInteraction {
  constructor() {
    super('dj', { djOnly: false });
  }

  run(client, interaction) {
    const callback = new InteractionResponse(client, interaction);

    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      return callback.send('У вас недостаточно прав для выполнения данного действия.', { flags: 64 });
    }
    switch (interaction.data.options?.[0]?.name) {
      case 'set':
        const role = Object.values(interaction.data.resolved.roles)[0];
        if (role.id === interaction.guild.id) return callback.send('Вы не можете установить @everyone в качестве роли DJ\'ея.', {
          flags: 64,
        });

        interaction.guild.cache.set('dj', role.id);
        client.database.collection('guilds').updateOne({ guildID: interaction.guild.id }, {
          $set: {
            dj: role.id,
          },
        });
        callback.send(`✅ Вы успешно установили роль **${role.name}** (${role.id}) в качестве роли диджея на данном сервере.`);
        break;
      case 'reset':
        interaction.guild.cache.set('dj', null);
        client.database.collection('guilds').updateOne({ guildID: interaction.guild.id }, {
          $set: {
            dj: null,
          },
        });
        callback.send('✅ Роль DJ\'ея была успешно сброшена на данном сервере.');
        break;
      default:
    }
  }
}

module.exports = DjInteraction;
