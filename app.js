var express = require('express'),
    formidable = require('formidable'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app     = express();

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.locals.isAuthenticated = false;
    next();
});

app.get("/form",function(req,res){
   res.render("form"); 
});

app.post("/form/verify",function(req,res){
    console.log(req.params.algo,req.body);
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        if(err) console.log(err);
        var oldPath = files.dataset.path,
            newPath = __dirname + "/"+files.dataset.name;
        fs.rename(oldPath,newPath,function(err){
            if(err) console.log(err);
            // console.log("File moved, new path = ",newPath);
            // train the input dataset here
            
            var linear      = require('./api/linear'),
                MatrixOps   = require("./api/matrix-operations");
            
            linear(newPath,function(theta){
                // console.log("Predictions:- ");
                // console.log(theta);
                // console.log("y(x = 35,000) = ",MatrixOps.MatrixMulti([[1,3.5]],theta)*1000);
                
                res.write("<html><body><div>" + MatrixOps.MatrixMulti([[1,3.5]],theta)*1000 +"</div></body></html>");
                res.end(); 
            
            });
    
        });
    });
});

app.get("*",function(req,res){
    res.render("index");
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log('The Government ain\'t listening but our server sure is' );
});