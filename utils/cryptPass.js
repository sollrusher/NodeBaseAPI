const bcrypt = require('bcryptjs');

function cryptPass(password) {
  return bcrypt.hash(password, 10);
}

module.exports = cryptPass;
