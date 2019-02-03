const express = require('express'),
      app     = express(),
      mongoose = require('mongoose'),
      bodyparser = require('body-parser'),
      naagrik = require('../models/meraAadhar.js'),
      seed = require('./seeds.js');
      
      app.use(bodyparser.urlencoded({extended: true})); 
      
      seed();
      app.get("/aadhar/api/getimage/:aadhar",function(req,res){
                naagrik.findOne({UID: req.params.aadhar},function(err,vyakti){
                    if(err) console.log(err);
                    res.json({'photo':vyakti.photo});
                })
      })
      
      app.get("/aadhar/api/getAllDetaails/:aadhar",function(req,res){
                naagrik.findOne({UID: req.params.aadhar},function(err,vyakti){
                    if(err) console.log(err);
                    res.json({'naagrik':vyakti});
                })
      })
      
      
      
      //module.exports= app;
      app.listen(process.env.PORT,process.env.IP,function(err){
          if(err)   console.log(err)
          console.log("Mera Aadhar, Mera Aawaz");
      })