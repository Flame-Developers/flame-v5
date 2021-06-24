/* eslint-disable global-require */
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (req, res) => res.send(
      { statusCode: 200, message: 'API works! Check documentation for more info.' },
    ),
  },
  ...require('./controllers/public/routes'),
  ...require('./controllers/private/routes'),
];
