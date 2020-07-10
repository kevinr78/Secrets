//jshint esversion:6
require('dotenv').config();
const express =require("express");
const app = express();
const ejs =require("ejs");
app.use(express.static("public"));
const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")
app.set('view engine', "ejs")
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/usersDB",{ useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema( {
    email:String,
    password:String
});




userSchema.plugin(encrypt, {secret: process.env.ENCKEY,encryptedFields:['password'] });

const userModel = mongoose.model('user', userSchema)



app.get("/",function(req,res){

    res.render('home')
})

app.get("/login",function(req,res){

    res.render('login')
})

app.get("/register",function(req,res){

    res.render('register')
});


app.post('/register',function(req,res){
    const newUser = new userModel({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log("Error")
        }else{
            res.render("secrets")
              }
    });

})

app.post('/login',function(req,res){
    
  const  password= req.body.password;
  const username= req.body.username;
  
  userModel.findOne({email:username},function(err,result){
      if(!err){
          if(result){
            if(result.password ===password){
                res.render('secrets')
            }
        }
      }else{
          console.log("error")
      }
  })

})
app.listen("3000", function(req,res){
    console.log("Server started succesfully");
    
});
