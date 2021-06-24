/* eslint-disable no-undef,quote-props */
const fetch = require('node-fetch');
const { encode } = require('querystring');

// eslint-disable-next-line no-unused-vars
async function processLogin(req, res) {
  const code = req.body?.code;
  const config = ApiWorker.config.oauth2;

  if (!code) {
    return {
      code: 401,
      message: 'Please provide a valid oauth2 code you\'ve got from Discord.',
    };
  }
  const body = {
    'client_id': config.id,
    'client_secret': config.secret,
    'grant_type': 'authorization_code',
    'redirect_uri': config.redirectURI,
    'scope': config.scopes.join(' '),
    code,
  };

  const data = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encode(body),
  });

  return data.json();
}

module.exports = processLogin;
