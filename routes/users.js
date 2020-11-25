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

router.get('/profile', async (req, res) => {
  await models.User.findOne({ where: { id: req.userId } }, { raw: true })
    .then((data) => {
      const {
        id, fullname, age, email, about,
      } = data;
      res.send({
        error: false,
        payload: {
          users: {
            id, fullname, age, email, about,
          } || [],
        },
      });
    })
    .catch((err) => res.json({
      error: true,
      message: err.message,
    }));
});

router.put('/:id', async (req, res) => {
  try {
    const {
      fullname, age, email, about,
    } = req.body;
    const { id } = req.params;

    // if (!fullname || !age || !email || !id) {
    //   throw new Error('Empty field');
    // }

    const user = await models.User.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    models.User.update(
      {
        fullname, age, email, about,
      },
      { where: { id } },
    );

    return res.send({
      error: false,
      payload: {
        user: {
          id, fullname, age, email, about,
        },
      },
    });
  } catch (err) {
    return res.json({
      error: true,
      message: err.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await models.User.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    models.User.destroy({ where: { id } });

    const { fullname, age, email } = user;
    res.send({
      error: false,
      payload: {
        users: {
          id, fullname, age, email,
        },
      },
      success: true,
    });
  } catch (err) {
    res.json({
      error: true,
      message: err.message,
    });
  }
});

module.exports = router;
