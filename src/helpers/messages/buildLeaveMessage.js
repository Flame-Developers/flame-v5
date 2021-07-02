/* eslint-disable quote-props */
const StringParserUtil = require('../../utils/misc/StringParserUtil');

module.exports = function buildLeaveMessage(member, message = '') {
  const keys = {
    'guild': member.guild.name,
    'guild.id': member.guild.id,
    'guild.memberCount': member.guild.memberCount,
    'user.id': member.user.id,
    'user.tag': member.user.tag,
    'user.joined': new Date(member.joinedAt).toLocaleString('ru'),
  };
  return StringParserUtil.parse(
    message, keys,
  );
};
