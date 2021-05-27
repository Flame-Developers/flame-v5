const { MessageEmbed } = require('discord.js');
const ReportService = require('../../services/ReportService');
const FlameListener = require('../../structures/FlameListener');
const Logger = require('../../utils/Logger');

class ShardReadyListener extends FlameListener {
  constructor() {
    super('ShardReadyListener', { event: 'shardReady' });
  }

  async run(client, id) {
    Logger.info(`Shard #${id} successfully connected.`);
    await ReportService.sendReport(
      new MessageEmbed()
        .setTitle(`Shard #${id ?? '-'} => Connected`)
        .setDescription(`**Process ID:** ${process.pid}\n**Date:** ${new Date().toLocaleString('ru')}\n**Timestamp:** ${Date.now()}`)
        .setColor('ffa500')
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp(),
    );
  }
}

module.exports = ShardReadyListener;
