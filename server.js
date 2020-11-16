const Sequelize = require("sequelize");
const express = require("express");

const allusers = require("./routes/users");
const register = require("./routes/register");
const auth = require("./routes/auth");
const headers = require("./middlewares/headers");

const app = express();

const sequelize = new Sequelize("fusionuser", "danila", "qwerty", {
  dialect: "postgres",
  host: "localhost",
});

app.use(headers);

app.use("/allusers", allusers);
app.use("/register", register);
app.use("/auth", auth);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, function () {
      console.log("Сервер ожидает подключения...");
    });
  })
  .catch((res) => res.status(418).send("Server not working"));
