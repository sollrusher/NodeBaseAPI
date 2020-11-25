const express = require('express');

const router = express.Router();
const decrypt = require('../utils/decryptPass');
const signJwt = require('../utils/signJwt');

const models = require('../models');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Empty fields');
    }

    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    if (!await decrypt(password, user.password)) {
      throw new Error('Password wrong');
    }

    const token = await signJwt(user.id);
    const { id, fullname, age } = user;
    return res.json({
      error: false,
      payload: {
        user: {
          id, fullname, age, email,
        },
        token,
      },
    });
  } catch (err) {
    return res.status(404).json({
      error: true,
      message: err.message,
    });
  }
});

module.exports = router;
