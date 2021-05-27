const { MessageEmbed } = require('discord.js');
const ReportService = require('../../services/ReportService');
const FlameListener = require('../../structures/FlameListener');
const Logger = require('../../utils/Logger');

class ShardDisconnectListener extends FlameListener {
  constructor() {
    super('ShardDisconnectListener', { event: 'shardDisconnect' });
  }

  async run(client, data, id) {
    Logger.warn(`Shard #${id} disconnected.`);
    await ReportService.sendReport(
      new MessageEmbed()
        .setTitle(`Shard #${id ?? '-'} => Disconnected`)
        .setDescription(`**PID:** ${process.pid}\n**Date:** ${new Date().toLocaleString('ru')}`)
        .setColor('ff3333')
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp(),
    );
  }
}

module.exports = ShardDisconnectListener;
