const bcrypt = require('bcryptjs');

function decryptPass(password, userPassword) {
  return bcrypt.compare(password, userPassword);
}

module.exports = decryptPass;
