module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (req, res) => res.send(
      { statusCode: 200, message: 'API works! Check documentation for more info.' },
    ),
  },
  // eslint-disable-next-line global-require
  ...require('./controllers/public/routes'),
];
