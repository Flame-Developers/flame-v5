/* eslint-disable quote-props */
const StringParserUtil = require('../../utils/misc/StringParserUtil');

module.exports = function buildAntiInviteMessage(member, message = '') {
  const keys = {
    'user': member,
    'user.tag': member.user.tag,
    'user.id': member.user.id,
  };
  return StringParserUtil.parse(
    message, keys,
  );
};
