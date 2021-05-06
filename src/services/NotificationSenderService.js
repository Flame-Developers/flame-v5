const StringParserUtil = require('../utils/StringParserUtil');

class NotificationSenderService {
  constructor() {
    throw new Error(`Class ${this.constructor.name} cannot be initialized.`);
  }

  // eslint-disable-next-line class-methods-use-this
  static handleNewJoin(member, data) {
    if (data.welcome?.enabled && data.welcome?.channel && data.welcome?.text) {
      member.guild.channels.cache.get(data.welcome.channel).send(
        StringParserUtil.parse(data.welcome.text, {
          guild: member.guild.name,
          user: member,
          'guild.id': member.guild.id,
          'guild.memberCount': member.guild.memberCount,
          'user.id': member.user.id,
          'user.tag': member.user.tag,
          'user.createdAt': new Date(member.user.createdAt).toISOString().replace('T', ' ').substr(0, 19),
        }),
      ).catch(() => {});
    }
    if (data.welcomeRole) {
      member.roles.add(data.welcomeRole, 'Автоматическая выдача роли новым участникам.').catch(() => {});
    }
  }

  // eslint-disable-next-line class-methods-use-this
  static handleMemberLeave(member, data) {
    if (data.leave?.enabled && data.leave?.channel && data?.leave.text) {
      member.guild.channels.cache.get(data.leave.channel).send(
        StringParserUtil.parse(data.leave.text, {
          guild: member.guild.name,
          'guild.id': member.guild.id,
          'guild.memberCount': member.guild.memberCount,
          'user.id': member.user.id,
          'user.tag': member.user.tag,
        }),
      ).catch(() => {});
    }
  }
}

module.exports = NotificationSenderService;
