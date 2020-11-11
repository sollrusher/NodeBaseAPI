const Sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
 
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const sequelize = new Sequelize("fusionuser", "danila", "qwerty", {
  dialect: "postgres",
  host: "localhost",
  define: {
    timestamps: false
  }
});

const User = sequelize.define("user", {
  fullname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

app.set("view engine", "hbs");

sequelize.sync().then(()=>{
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
}).catch(err=>console.log(err));

app.get('/', function(req, res){
  res.render("index.hbs")
});

app.post('/', urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const userEmail = req.body.email;
  const userPassword = req.body.password;


})
app.get("/register", function(req, res){
  res.render("register.hbs");
});

app.post("/register", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
       
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.email;
  const age = req.body.age;

  const cryptoPassword = CryptoJS.AES.encrypt(password, 'secret').toString();
  
  User.create({ name: fullname, email: email, password: cryptoPassword,  age: age }).then(()=>{
    res.redirect("/");
  }).catch(err=>console.log(err));
});