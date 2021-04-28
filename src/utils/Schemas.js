module.exports = {
  GuildSchema: {
    prefix: 'f.',
    ideaChannel: null,
    warnings: [],
    ideas: [],
    welcome: {
      enabled: false,
      text: null,
      channel: null,
    },
    leave: {
      enabled: false,
      text: null,
      channel: null,
    },
    welcomeRole: null,
    currency: '$',
    work: { min: 100, max: 400 },
    items: [],
    cooldown: {
      work: 3600 * 3,
      crime: 3600 * 5,
      rob: 3600 * 24,
      fish: 3600 * 3,
      mine: 3600 * 5,
    },
    moderator: null,
    muteRole: null,
    disabledCommands: [],
    modules: {
      moderation: true,
      economy: true,
      music: true,
    },
    antiInvite: {
      enabled: false,
      message: null,
      whiteList: [],
    },
  },
  UserSchema: {
    money: 0,
    bank: 0,
    pickaxe: {
      wood: false,
      stone: false,
      iron: false,
      diamond: false,
    },
    rods: {
      wood: false,
      stone: false,
      copper: false,
      iron: false,
      steel: false,
      titanium: false,
    },
    transport: {
      boad: false,
      carriage: false,
    },
    payments: {
      list: [],
      blocked: false,
    },
    ideaBlacklist: false,
  },
};
