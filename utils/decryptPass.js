const bcrypt = require('bcryptjs');

function decryptPass(password, userPassword) {
  return bcrypt.compareSync(password, userPassword);
}

module.exports = decryptPass;
