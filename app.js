var express = require('express'),
    app     = express();

app.get("*",function(req,res){
    res.write("<html><head><title>No Title</title></head><body>You have reached the correct website but it is under development. Inconvenience is regretted</body></html>");
    res.end();
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log('The Government ain\'t listening but our server sure is' );
});