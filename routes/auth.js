var express = require("express");
var router  = express.Router(),
    mongoose=require('mongoose'),
    passport        = require("passport");
var User =require("../models/user"),
formidable=require('formidable');

mongoose.connect("mongodb://localhost:27017/officer",{useNewUrlParser:true});

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    console.log(req.body);
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) throw err;
        console.log("fields: ",fields['username'],fields['password']);
        console.log("files: ",files);
        User.register(new User({username: fields['username']}),fields['password'], function(err,User){
           if(err){
            console.log(err);
            return res.render("register");
           }
           else{
               passport.authenticate("local")(req,res,function(){
                  res.redirect("/");
               });
           }
        });
    });
})

router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err)
        throw err;
        req.body=fields;
        next();
    });
},passport.authenticate("local",{failureRedirect: "/login"}),function(req,res){
    console.log(req.user);
    res.redirect("/");
})

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

router.get("/",function(req,res){
    res.render("index");
});




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;