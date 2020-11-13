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
  
  User.create({ fullname: fullname, email: email, password: cryptoPassword,  age: age }).then(()=>{
    jwt.sign({ email: email}, 'secretjwt', (err, token) => {
      res.json({
        token,
      });
    });
  }).catch(err=>console.log(err));
});

app.post("/auth" , urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(404);

  const email = req.body.email;
  const password = req.body.password;

  User.findAll({where:{email: email} ,raw: true }).then(data=>{
    if(!data) {res.send('none'); return res.sendStatus(404);}

    const bytes  = CryptoJS.AES.decrypt(data[0].password, 'secret');
    const cryptoPassword = bytes.toString(CryptoJS.enc.Utf8);

    if(cryptoPassword == password)
{    
  jwt.sign({ email: email}, 'secretjwt', (err, token) => {
    res.json({
      token,
    });
  });
}
    else
    res.sendStatus(404)

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
    !id) return res.sendStatus(400)

    

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
  const id = req.body.id;

    User.findAll({where: {id: id}}).then((data) => {
      if(data.length == 0){return res.sendStatus(404)}
      else {
        User.destroy({where: {id: id} }).then(() => {
          res.send(`User with id ${id} was deleted`)
        }).catch(err=>console.log(err));
      }
    })

  
}
  });
});