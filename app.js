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

sequelize.sync().then(()=>{
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
}).catch(err=>console.log(err));

app.get("/allusers",verifyToken , function (req, res) {
  jwt.verify(req.token, "secretjwt", (err, authData) => {
    if(err){
      res.sendStatus(403);
    } else {
      User.findAll({raw: true }).then(data=>{
        res.send(data);
      }).catch(err=>console.log(err));

    }
  })

})

app.post("/register", urlencodedParser,  function (req, res) {
         
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
app.post("/edit", verifyToken , urlencodedParser, function (req, res) {
  jwt.verify(req.token, "secretjwt", (err, authData) => {
    if(err){
      res.sendStatus(403);
    } else {
  if(!req.body) return res.sendStatus(400);
 
  const fullname = req.body.fullname;
  const age = req.body.age;
  const email = req.body.email;
  const id = req.body.id;

  if (!fullname ||
    !age ||
    !email ||
    !id) res.send('invalid data')

    

  User.update({fullname: fullname, age: age, email:email}, {where: {id: id} }).then(() => {

    res.send(`New name is - ${fullname} `);
  })
  .catch(err=>console.log(err));
}
});
});
 
app.post("/delete", verifyToken , urlencodedParser, function(req, res){
  jwt.verify(req.token, "secretjwt", (err, authData) => {
    if(err){
      res.sendStatus(403);
    } else {  
      console.log('req.body.id - ', req.body.id)
  const id = req.body.id;

      if(!User.findAll({where: {id: id}})) res.send('Wrong id')

  User.destroy({where: {id: id} }).then(() => {
    res.send(`User with id ${id} was deleted`)
  }).catch(err=>console.log(err));
}
  });
});