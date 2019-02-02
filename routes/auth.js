var express = require("express");
var router  = express.Router(),
    passport        = require("passport");
var User =require("../models/user");


router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password, function(err,User){
       if(err){
        console.log(err);
        return res.render("register");
       }
       else{
           passport.authenticate("local")(req,res,function(){
              res.redirect("/campgrounds")
           })
       }
    });
})

router.get("/login",function(req,res){
            res.render("login");
});

router.post("/login",passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}
        ),function(req,res){
})

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})

router.get("/",function(req,res){
    res.render("home");
});




function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;