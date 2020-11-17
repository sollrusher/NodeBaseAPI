const express = require('express');

const router = express.Router();
const models = require('../models');
const verifyToken = require('../middlewares/jwtVerify');

router.use(verifyToken);

router.get('/', async (req, res) => {
  await models.User.findAll(
    {
      attributes: ['fullname', 'email', 'age'],
    },
    { raw: true },
  )
    .then((data) => {
      res.send({
        error: false,
        payload: {
          users: data || [],
        },
      });
    })
    .catch((err) => res.json({
      error: true,
      message: err.message,
    }));
});

router.get('/:id', async (req, res) => {
  await models.User.findOne({ where: { id: req.params.id } }, { raw: true })
    .then((data) => {
      res.send({
        error: false,
        payload: {
          users: data || [],
        },
      });
    })
    .catch((err) => res.json({
      error: true,
      message: err.message,
    }));
});

router.put('/:id', async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const { fullname, age, email } = req.body;
  const { id } = req.params;

  if (!fullname || !age || !email || !id) {
    return res.sendStatus(400);
  }

  await models.User.findOne({ where: { id } })
    .then((data) => {
      if (!data) {
        throw new Error('User not found');
      }
      models.User.update(
        { fullname, age, email },
        { where: { id } },
      )
        .then(() => {
          res.send({
            error: false,
            payload: {
              user: data || [],
            },
          });
        })
        .catch((err) => res.json({
          error: true,
          message: err.message,
        }));
    })
    .catch((err) => res.json({
      error: true,
      message: err.message,
    }));
  return res.send('ok');
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await models.User.findOne({ where: { id } })
    .then((data) => {
      if (!data) {
        throw new Error('User not found');
      }

      models.User.destroy({ where: { id } })
        .then(() => {
          res.send({
            error: false,
            payload: {
              users: data || [],
            },
            success: true,
          });
        })
        .catch((err) => res.json({
          error: true,
          message: err.message,
        }));
    })
    .catch((err) => res.json({
      error: true,
      message: err.message,
    }));
});

module.exports = router;
