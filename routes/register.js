const express = require('express');

const router = express.Router();

const models = require('../models');
const signJwt = require('../utils/signJwt');
const cryptPass = require('../utils/cryptPass');

router.post('/', async (req, res) => {
  try {
    if (
      !req.body.fullname
      || !req.body.email
      || !req.body.password
      || !req.body.age
    ) {
      throw new Error('Empty field');
    }

    const { fullname } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { age } = req.body;

    const cryptoPassword = await cryptPass(password);

    const user = await models.User.create({
      fullname,
      email,
      password: cryptoPassword,
      age,
    });
    const token = await signJwt(user.id);
    return res.json({
      error: false,
      payload: {
        user: { fullname, email, age },
        token,
      },
    });
  } catch (err) {
    return res.json({
      error: true,
      message: err.message,
    });
  }
});

module.exports = router;
