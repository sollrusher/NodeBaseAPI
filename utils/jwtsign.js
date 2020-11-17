const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig');

function signJwt(userId) {
  return new Promise((res, rej) => {
    jwt.sign({ userId }, config.secretJwt, (error, token) => {
      res(token);
      rej(error);
    });
  });
}

module.exports = signJwt;
