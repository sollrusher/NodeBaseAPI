const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, "secretjwt", (err) => {
      if (err) {
        res.status(403).send("wrong token");
      } else next();
    });
  } else {
    res.status(403).send("token missing");
  }
}

module.exports = verifyToken;
