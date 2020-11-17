const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const register = require('./routes/register');
const auth = require('./routes/auth');
const cors = require('./middlewares/cors');

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const sequelize = new Sequelize('fusionuser', 'danila', 'qwerty', {
  dialect: 'postgres',
  host: 'localhost',
});

app.use(cors);
app.use(urlencodedParser);

app.use('/users', users);
app.use('/register', register);
app.use('/auth', auth);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('Сервер ожидает подключения...');
    });
  })
  .catch((res) => res.status(418).send('Server not working'));
