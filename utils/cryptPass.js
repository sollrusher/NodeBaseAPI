const bcrypt = require('bcryptjs');

function cryptPass(password) {
  return bcrypt.hashSync(password, 10);
}

module.exports = cryptPass;
