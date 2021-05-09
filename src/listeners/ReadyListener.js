const FlameListener = require('../structures/FlameListener');
const MuteManager = require('../managers/MuteManager');
const ReminderManager = require('../managers/ReminderManager');

class ReadyListener extends FlameListener {
  constructor() {
    super('ReadyListener', { event: 'ready' });
  }

  async run(client) {
    /**
     * Подгрузка всех мьютов, напоминаний и кулдаунов после перезапуска бота.
     */

    const mutes = await client.database.collection('mutes').find().toArray();
    const reminders = await client.database
      .collection('reminders')
      .find()
      .toArray();

    mutes.forEach((mute) => new MuteManager(client).handle(mute));
    reminders.forEach((reminder) =>
      new ReminderManager(client).handle(reminder)
    );

    client.user.setActivity('https://github.com/TheFerryn/Flame', { type: 3 });
    return console.log(
      `[Bot] Logged in as ${client.user.tag} (${client.user.id})`
    );
  }
}

module.exports = ReadyListener;
