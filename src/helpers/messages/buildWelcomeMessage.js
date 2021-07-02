/* eslint-disable quote-props */
const StringParserUtil = require('../../utils/misc/StringParserUtil');

module.exports = function buildWelcomeMessage(member, message = '') {
  const keys = {
    'guild': member.guild.name,
    'guild.id': member.guild.id,
    'guild.memberCount': member.guild.memberCount,
    'user': member,
    'user.id': member.user.id,
    'user.tag': member.user.tag,
    'user.registered': new Date(member.user.createdAt).toLocaleString('ru'),
  };
  return StringParserUtil.parse(
    message, keys,
  );
};
