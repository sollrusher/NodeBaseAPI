const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader === 'undefined') {
    return res.status(400).send({
      error: true,
      message: 'Token missing',
    });
  }
  const bearerToken = bearerHeader.split(' ')[1];
  req.token = bearerToken;
  return jwt.verify(bearerToken, 'secretjwt', (err, decodec) => {
    if (err) {
      return res.status(400).send({
        error: true,
        message: 'Wrong token',
      });
    }
    req.userId = decodec.userId;
    return next();
  });
}

module.exports = verifyToken;
