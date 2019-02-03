const express = require('express'),
      app     = express(),
      mongoose = require('mongoose'),
      bodyparser = require('body-parser'),
      naagrik = require('../models/meraAadhar.js');


var vyakti=[
    {
    UID: "123456789",
    name: "OliverQueen",
    address: "star city",
    mobile: "9876543210",
    photo: "123456789api"
},{
    UID: "25648520",
    name: "ShiamSansare",
    address: "sandharust roda",
    mobile: "99674656",
    photo: "25648520",
},{
    UID: "2563210150",
    name: "Dhruvil Shah",
    address: "sion",
    mobile: "8850123456",
    photo: "2563210150api"
}]
function seed(){
    vyakti.forEach(function(person){
        naagrik.create(person, function(err,meraAawaz){
    if(err) console.log(err)
    else{
        meraAawaz.save();
    }
})
})
}


module.exports = seed;