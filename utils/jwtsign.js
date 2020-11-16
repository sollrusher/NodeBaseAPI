const jwt = require("jsonwebtoken");
const secretjwt = require("../config/serverConfig");

function jwtsign(res, email) {
  jwt.sign({ email: email }, secretjwt, (err, token) => {
    res.json({
      token,
    });
  });
}

module.exports = jwtsign;
