require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app =express();

app.use(express.static("public"));

app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: "String",
  password: "String"
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User" , userSchema);

app.get("/", function(req,res){
  res.render("home")
});

///////////Login user/////////

app.route("/login")

.get(function(req,res){
  res.render("login")
})

.post(function(req,res){
  User.findOne({email:req.body.username} ,
  function(err, foundUser){
    if(foundUser && foundUser.password === req.body.password)
    res.render("secrets")
    else
    res.send("No User Found! Please register first.")
  })
})


//////////// Register User//////////

app.route("/register")

.get(function(req,res){
  res.render("register")
})

.post(function(req,res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err){
    if(!err)
    res.render("secrets")
  })
});

app.listen(3000 , function(){
  console.log("Port Started!");
})
