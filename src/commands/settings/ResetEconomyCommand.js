const FlameCommand = require('../../structures/FlameCommand');

class ResetEconomyCommand extends FlameCommand {
  constructor() {
    super('reset-economy', {
      description: 'Полностью сбрасывает экономику и прогрессы всех участников на сервере.',
      category: 'settings',
      usage: 'reset-economy',
      aliases: [],
      examples: [],
      cooldown: 120,
      userPermissions: ['ADMINISTRATOR'],
    });
  }

  async run(message, args) {
    // eslint-disable-next-line max-len
    const msg = await message.channel.send(':question: Вы уверены, что **полностью** хотите сбросить прогрессы всех участников в экономике на данном сервере? Напишите в течении 25-секунд `Да, я уверен` для продолжения процесса сброса.\n\n:warning: **ВНИМАНИЕ:** __ДАННОЕ ДЕЙСТВИЕ НЕЛЬЗЯ БУДЕТ ОТМЕНИТЬ. ВСЕ ДАННЫЕ СТИРАЮТСЯ БЕЗ ВОЗМОЖНОСТИ ВОССТАНОВЛЕНИЯ.__');
    await message.channel.awaitMessages((m) => m.author.id === message.author.id, { max: 1, time: 25000, errors: ['time'] })
      .then((collected) => {
        if (collected.first().content !== 'Да, я уверен') msg.edit('Процесс отменен.');
        else {
          msg.edit('<a:processing:853669211028324402> Идет сброс экономики... подождите пожалуйста.');
          message.client.database.collection('guildusers').updateMany({ guildID: message.guild.id }, {
            $set: {
              money: 0,
              bank: 0,
              ownedPickaxes: [],
              ownedRods: [],
              ownedTransport: [],
            },
          });
          msg.edit(`${message.client.constants.emojis.DONE} Экономика была успешно сброшена.`);
        }
      })
      .catch(() => msg.edit(`${message.client.constants.emojis.FAIL} Я не получил никакого ответа в течении 25 секунд.`));
  }
}

module.exports = ResetEconomyCommand;
