const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const models = require("../models");
const verifyToken = require("../middlewares/jwtVerify");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(verifyToken);

router.get("/", async function (req, res) {
  await models.User.findAll({ raw: true })
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

router.post("/edit", urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400);

  const fullname = req.body.fullname;
  const age = req.body.age;
  const email = req.body.email;
  const id = req.body.id;

  if (!fullname || !age || !email || !id) return res.sendStatus(400);

  await models.User.findAll({ where: { id: id } }).then((data) => {
    if (data.length == 0) {
      return res.status(404).send({
        error: false,
        payload: {
          users: data || [],
        },
      });
    } else {
      models.User.update(
        { fullname: fullname, age: age, email: email },
        { where: { id: id } }
      )
        .then(() => {
          res.send({
            error: false,
            payload: {
              user: data || [],
            },
          });
        })
        .catch(() => res.status(418).send("Something went wrong"));
    }
  });
});

router.post("/delete", urlencodedParser, async function (req, res) {
  const id = req.body.id;

  await models.User.findAll({ where: { id: id } }).then((data) => {
    if (data.length == 0) {
      return res.status(404).send({
        error: false,
        payload: {
          users: data || [],
        },
        success: false,
      });
    } else {
      models.User.destroy({ where: { id: id } })
        .then(() => {
          res.send({
            error: false,
            payload: {
              users: data || [],
            },
            success: true,
          });
        })
        .catch(() => res.status(418).send("Something went wrong"));
    }
  });
});

module.exports = router;
