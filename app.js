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
    api     = require("./aadharAPI/api"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://"+process.env.IP+"/officer",{useNewUrlParser:true});
    
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(cookie());
app.use(session({secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(api);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user,done)=>{
    // console.log('serialize user ',user.id);
    return done(null,user.id);
});

app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
});


passport.deserializeUser((id,done)=>{
    // console.log('deserialize user ',id);
    User.findById(id,(err,user)=>{
        if(err) console.log(err);
        return done(null,user);
    });
});
app.use(auth);


app.get("/form",middle.isLoggedIn,function(req,res){
    res.render("form");
});

app.get("/web3",function(req,res){
    res.render("web3");
});


app.get("/image/:id",function(req,res){
         console.log(req.params.id);
         var options = {
         root: __dirname + '/public/face/',
         dotfiles: 'allow',
         headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
            }
        };
        
        // console.log("req params id: ",req);
        res.sendFile(req.params.id,options,function(err){
            if(err){
                console.log(err)
            }else{
                console.log("sent");
            }
        })
     })

app.post("/form/verify",function(req,res){

    var fotoArray = [],
        responses = [];
    
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) throw(err);
        // console.log(files);
        req.session.buyer=fields['reg[buyer]'];
        req.session.PIN=fields['reg[PIN]'];
        req.session.seller=fields['reg[seller]'];
        req.session.witness=fields['reg[witness]'];
        fotoArray.push(fields['reg[buyer]']);
        fotoArray.push(fields['reg[seller]']);
        fotoArray.push(fields['reg[witness]']);
        var oldPath = files.regDataSet0.path,
            newPath = __dirname + "/public/face/"+fields['reg[buyer]']+".jpg";
        fs.rename(oldPath,newPath,function(err){
            if(err) console.log(err);
            
            oldPath = files.regDataSet1.path;
            newPath = __dirname + "/public/face/"+fields['reg[seller]']+".jpg";
            
            fs.rename(oldPath,newPath,function(err){
                if(err) throw err;
                
                oldPath = files.regDataSet2.path;
                newPath = __dirname + "/public/face/"+fields['reg[witness]']+".jpg";
            fs.rename(oldPath,newPath,function(err){
                if(err) throw err;
            // verify
            fotoArray.forEach(function(face){
                //console.log("face",face);
                var options = {
                    url: 'https://land-registration-tarunl.c9users.io/aadhar/api/getimage/'+face,
                    method:"GET"
                };
                requestp(options).then( data => {
                    console.log(data);
                    var image = data.photo;
                    responses.push(veriface(face,image));
                });    
            })
            if(responses.length==3){
                    var count=-1;
                    responses.forEach(function(response){
                        count++;
                        if(response==false){
                            switch(count){
                                case 0: res.JSON({"error":"Buyer Invalid"});
                                        break;
                                case 1: res.JSON({"error":"seller photo Invalid"});
                                        break;
                                case 2: res.JSON({"error":"witness photo Invalid"});
                                        break;
                            }
                        }else{
                            // res.send("verify aadhar details");
                            res.redirect('/form/callback');
                        }
                    })
                }
                
            
            
            });
            
            });
    
        });
    });
});

app.get('/form/callback',function(req,res){
    var transactionObject = {
        buyerId : req.session.buyer,
        sellerId : req.session.seller,
        witnessId : req.session.witness,
        PIN : req.session.PIN
    };
    res.render("transaction",transactionObject);
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('The Government ain\'t listening but our server sure is' );
});