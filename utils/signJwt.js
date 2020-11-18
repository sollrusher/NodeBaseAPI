const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig');

function signJwt(userId) {
  return new Promise((res, rej) => {
    jwt.sign({ userId }, config.secretJwt, (error, token) => {
      if (error) {
        rej(new Error('Error in token'));
      }
      res(token);
    });
  });
}

module.exports = signJwt;
