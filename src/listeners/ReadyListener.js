const FlameListener = require('../structures/FlameListener');
const MuteManager = require('../managers/MuteManager');
const CooldownManager = require('../managers/CooldownManager');
const ReminderManager = require('../managers/ReminderManager');
const Logger = require('../utils/misc/Logger');

class ReadyListener extends FlameListener {
  constructor() {
    super('ReadyListener', { event: 'ready' });
  }

  async run(client) {
    /**
     * Подгрузка всех мьютов, напоминаний и кулдаунов после перезапуска бота.
     * TODO: Автоматически загружать все сервисы и запускать их из FlameClient#managers.
     */

    await new MuteManager(client).handle(10000);
    await new ReminderManager(client).handle(10000);
    await new CooldownManager(client).handle();

    await client.user.setActivity('https://flamebot.ru', { type: 3 });
    return Logger.info(
      `Logged in as ${client.user.tag} (${client.user.id})`,
    );
  }
}

module.exports = ReadyListener;
