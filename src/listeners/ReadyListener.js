const FlameListener = require('../structures/FlameListener');
const MuteManager = require('../managers/MuteManager');
const CooldownManager = require('../managers/CooldownManager');
const ReminderManager = require('../managers/ReminderManager');
const StatisticsSenderService = require('../services/StatisticsSenderService');
const Logger = require('../utils/misc/Logger');

class ReadyListener extends FlameListener {
  constructor() {
    super('ReadyListener', { event: 'ready' });
  }

  async run(client) {
    /**
     * Подгрузка всех мьютов, напоминаний и кулдаунов после перезапуска бота.
     */

    const mutes = await client.database.collection('mutes').find().toArray();
    const cooldowns = await client.database.collection('cooldowns').find().toArray();
    const reminders = await client.database
      .collection('reminders')
      .find()
      .toArray();

    mutes.forEach((mute) => new MuteManager(client).handle(mute));
    cooldowns.forEach((cooldown) => new CooldownManager(client).handle(cooldown));
    reminders.forEach((reminder) => new ReminderManager(client).handle(reminder));

    new StatisticsSenderService(client).init();

    await client.user.setActivity('https://flamebot.ru', { type: 3 });
    return Logger.info(
      `Logged in as ${client.user.tag} (${client.user.id})`,
    );
  }
}

module.exports = ReadyListener;
