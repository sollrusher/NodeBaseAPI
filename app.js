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

app.post('/allusers', urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  User.findAll({where:{email: userEmail} ,raw: true }).then(data=>{
    if(!data) {res.send('none'); return res.sendStatus(400);}
    const bytes  = CryptoJS.AES.decrypt(data[0].password, 'secret');
    const cryptoPassword = bytes.toString(CryptoJS.enc.Utf8);

    // if(cryptoPassword == userPassword)
    // res.redirect("/allusers");
    // else
    // res.send('none')
    
  }).catch(err=>console.log(err));
  
})

app.get("/allusers",verifyToken ,urlencodedParser, function (req, res) {
  jwt.verify(req.token, "secretjwt", (err, authData) => {
    if(err){
      res.sendStatus(403);
    } else {
      User.findAll({raw: true }).then(data=>{
        res.render("allusers.hbs", {
          users: data
          
        });
      }).catch(err=>console.log(err));

    }
  })

})

app.get("/register", function(req, res){
  res.render("register.hbs");
});

app.post("/register", urlencodedParser, function (req, res) {
         
  if(!req.body.fullname || !req.body.email || !req.body.password || !req.body.age) return res.sendStatus(400);

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const age = req.body.age;

  const cryptoPassword = CryptoJS.AES.encrypt(password, 'secret').toString();

  jwt.sign({ email: email}, 'secretjwt', (err, token) => {
    res.json({
      token,
    });
  });
  
  User.create({ fullname: fullname, email: email, password: cryptoPassword,  age: age }).then(()=>{
    
  }).catch(err=>console.log(err));
});

function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined'){
    const bearerToken = bearerHeader.split(' ')[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}

// получаем объект по id для редактирования
app.get("/edit/:id", function(req, res){
  const userid = req.params.id;
  User.findAll({where:{id: userid}, raw: true })
  .then(data=>{
    res.render("edit.hbs", {
      user: data[0]
    });
  })
  .catch(err=>console.log(err));
});
 
// обновление данных в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const username = req.body.name;
  const userage = req.body.age;
  const userid = req.body.id;
  User.update({name:username, age: userage}, {where: {id: userid} }).then(() => {
    res.redirect("/allusers");
  })
  .catch(err=>console.log(err));
});
 
// удаление данных
app.post("/delete/:id", function(req, res){  
  const userid = req.params.id;
  User.destroy({where: {id: userid} }).then(() => {
    res.redirect("/allusers");
  }).catch(err=>console.log(err));
});