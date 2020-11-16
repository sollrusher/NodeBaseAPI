const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwtsign = require("../utils/jwtsign");

const models = require("../models");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(404);

  const email = req.body.email;
  const password = req.body.password;

  await models.User.findAll({ where: { email: email }, raw: true })
    .then((data) => {
      if (data.length == 0) {
        res.status(404).send("Email not found");
        return;
      }

      if (bcrypt.compareSync(password, data[0].password)) {
        jwtsign(res, email);
      } else res.status(404).send("Wrong password");
    })
    .catch(() => res.status(418).send("Something went wrong"));
});

module.exports = router;
