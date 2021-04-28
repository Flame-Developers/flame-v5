module.exports = [
  {
    method: 'GET',
    url: '/public/stats',
    handler: require('./methods/collectStatistics'),
  },
  {
    method: 'GET',
    url: '/public/commands',
    handler: require('./methods/getCommands'),
  }
];
