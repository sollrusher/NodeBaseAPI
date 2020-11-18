const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./routes/users');
const register = require('./routes/register');
const auth = require('./routes/auth');
const config = require('./config/serverConfig').database;

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json({ extended: false });

const sequelize = new Sequelize(config.dbName, config.user, config.password, {
  dialect: config.dialect,
  host: config.host,
});

app.use(cors());
app.use(urlencodedParser);
app.use(jsonParser);

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
