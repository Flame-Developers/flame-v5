const { MessageEmbed } = require('discord.js');
const ReportService = require('../../services/ReportService');
const FlameListener = require('../../structures/FlameListener');

class ShardReadyListener extends FlameListener {
  constructor() {
    super('ShardReadyListener', { event: 'shardReady' });
  }

  async run(client, id) {
    await ReportService.sendReport(
      new MessageEmbed()
        .setTitle(`Shard #${id ?? '-'} => Connected`)
        .setDescription(`**PID:** ${process.pid}\n**Date:** ${new Date().toLocaleString('ru')}`)
        .setColor('ffa500')
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp(),
    );
  }
}

module.exports = ShardReadyListener;
