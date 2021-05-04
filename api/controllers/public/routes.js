/* eslint-disable */

module.exports = [
  {
    method: 'GET',
    url: '/public/stats',
    handler: require('./methods/collectStatistics').collectBotStatistics,
  },
  {
    method: 'GET',
    url: '/public/stats/nodes',
    handler: require('./methods/collectStatistics').collectNodesStatistics,
  },
  {
    method: 'GET',
    url: '/public/commands',
    handler: require('./methods/getCommands'),
  }
];
