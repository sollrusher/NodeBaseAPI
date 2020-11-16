const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const models = require("../models");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, async function (req, res) {
  if (
    !req.body.fullname ||
    !req.body.email ||
    !req.body.password ||
    !req.body.age
  )
    return res.status(400).send("empty field");

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;

  const cryptoPassword = bcrypt.hashSync(password, 10);

  await models.User.create({
    fullname: fullname,
    email: email,
    password: cryptoPassword,
    age: age,
  })
    .then((data) => {
      res.send({
        error: false,
        payload: {
          users: data || [],
        },
      });
    })
    .catch(() => res.status(418).send("Something went wrong"));
});

module.exports = router;
