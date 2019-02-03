const express = require('express'),
      app     = express(),
      requestp= require('request-promise'),
      fs      = require('fs');
     
    function veriface(firstFace , foundFace){
        //console.log(foundFace);
        
        var faces = [];
        var   options={
          uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender',
          method: 'POST',
          headers: {
              'Content-type': 'application/json',
              'Ocp-Apim-Subscription-Key': '8eb5ec7aad4d4982a3f0616e14170b0b'
          },
          body: {
              "url": "https://land-registration-tarunl.c9users.io/image/"+firstFace+".jpg"
          },
          json: true
      };
      foundFace=firstFace+"api";
      console.log(foundFace);
      //console.log(options);
      requestp(options).then(data =>  {
          //  console.log(data);
            faces[0]=data[0].faceId;
            var options2={
                uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender',
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                  'Ocp-Apim-Subscription-Key': '8eb5ec7aad4d4982a3f0616e14170b0b'
                },
                body: {
                    "url": "https://land-registration-tarunl.c9users.io/image/"+foundFace+".jpg"
                },
                json: true
            };
            requestp(options2).then((data1) => {
                //console.log(data1);
            console.log(data1[0].faceId)
          faces[1]=data1[0].faceId;
          console.log(faces)
          faces.forEach(function(face){
              console.log(face);
          });
          var   options1={
                      
                      uri: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify?',
                      method: 'POST',
                      headers: {
                          'Content-type': 'application/json',
                          'Ocp-Apim-Subscription-Key': '8eb5ec7aad4d4982a3f0616e14170b0b'
                      },
                      body: {
                          "faceId1": faces[0],
                          "faceId2": faces[1]
                      },
                      json: true
                  };
                requestp(options1).then(data  => {
                    var value;
                    //console.log(data);
                    if(parseFloat(data.confidence)>0.35 && data.isIdentical==true){
                        //value=true;
                        console.log("true");
                    }else{
                        //value=false;
                        console.log("false");
                    }
                }).catch(function(err){
                    console.log("requestp options verify",err);
                });
          
      })
      .catch(function(err){
          console.log(err);
      })
      })
      .catch(function(err){
          console.log(err);
      })
    
        //return value;
    }
    
    module.exports= veriface;

      