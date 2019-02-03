var express = require('express'),
    formidable = require('formidable'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app     = express(),
    request = require('request'),
    requestp= require('request-promise'),
    cookie  = require('cookie-parser'),
    veriface= require('./faceVerification'),
    middle  = require('./middleware/index'),
    passport        = require("passport"),                      //tool to check for login and stuff, this could also be used for stuff like sign in with fb,gmail,etc
    LocalStrategy   = require("passport-local"),                //tool for a local login i.e. on our own page
    session = require('express-session'),
    auth = require('./routes/auth.js'),
    User    = require('./models/user.js'),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost:27017/officer",{useNewUrlParser:true});
    
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(cookie());
app.use(session({secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    if(req.isAuthenticated()){
        res.locals.user=req.user;
        console.log(req.user)
    }
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(auth);


app.get("/form",/*middle.isLoggedIn,*/function(req,res){
    res.render("form");
});

app.get("/web3",function(req,res){
    res.render("web3");
});


app.get("/image/:id",function(req,res){
         var options = {
         root: __dirname + '/public/face/',
         dotfiles: 'allow',
         headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
            }
        };
        res.sendfile(req.params.id,options,function(err){
            if(err){
                console.log(err)
            }else{
                console.log("sent");
            }
        })
     })

app.post("/form/verify",function(req,res){
    console.log(req.params.algo,req.body);
    var fotoArray = [],
        responses = [];
    
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) console.log(err);
        console.log(fields);
        req.session.buyer=fields['reg[buyer]'];
        req.session.seller=fields['reg[seller]'];
        req.session.witness=fields['reg[witness]'];
        fotoArray.push(fields['reg[buyer]']);
        fotoArray.push(fields['reg[seller]']);
        fotoArray.push(fields['reg[witness]']);
        var oldPath = files.regDataSet0.path,
            newPath = __dirname + "/public/face/"+files.regDataSet0.name;
        fs.rename(oldPath,newPath,function(err){
            if(err) console.log(err);
            
            oldPath = files.regDataSet1.path;
            newPath = __dirname + "/public/face/"+files.regDataSet1.name;
            
            fs.rename(oldPath,newPath,function(err){
                if(err) throw err;
                
                oldPath = files.regDataSet2.path;
                newPath = __dirname + "/public/face/"+files.regDataSet2.name;
            fs.rename(oldPath,newPath,function(err){
                if(err) throw err;
            // verify
            fotoArray.forEach(function(face){
                var options = {
                    url: 'https://land-registration-tarunl.c9users.io/aadhar/api/getimage/'+face,
                    method:"GET"
                };
                requestp(options).then( (data) => {
                    var image = data.photo;
                    responses.push(veriface(face,image));
                });    
            }).then( (data) =>{
                if(responses.length==3){
                    var count=-1;
                    responses.forEach(function(response){
                        count++;
                        if(response===false){
                            switch(count){
                                case 0: res.JSON({"error":"Buyer Invalid"});
                                        break;
                                case 1: res.JSON({"error":"seller photo Invalid"});
                                        break;
                                case 2: res.JSON({"error":"witness photo Invalid"});
                                        break;
                            }
                        }else{
                            res.send("verify aadhar details");
                        }
                    })
                }
                
            });
            
            });
            
            });
    
        });
    });
});

app.get('/form/callback',function(req,res){
    var transactionObject = {
        buyerId : req.session.buyer,
        sellerId : req.session.seller,
        witnessId : req.session.witness
    };
    res.render("transaction",transactionObject);
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('The Government ain\'t listening but our server sure is' );
});