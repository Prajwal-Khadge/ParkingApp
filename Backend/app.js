//Express declarations
const express = require('express');
const bodyParser = require("body-parser");


//Mongoose declarations
const mongoose = require('mongoose');
const Location = require('./models/location');

//create server i.e initialize server
const app = express();

//Connect to mongoose which returns a promise
mongoose.connect('mongodb+srv://admin:admin@cluster0.9tttj.mongodb.net/Parking?retryWrites=true&w=majority').then(() => {
    console.log("Connected to database");
}).catch(() => {
    console.log("Connection failed");
}); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});


//Return data for markers
app.get("/", (req, res, next) => {
 Location.find({}, '_id name centerX centerY numOfParkingUsed totalParkingCapacity').then(results => {
    res.send({
        data: results
    });
  });  
});



//Handles requests for parking
app.post("/parkRequest/:id", (req, res, next) =>{
  
  //Parking ID
  const parkingID = req.params.id;

  //temp has userLatitude and userLongitude
  location = req.body;

  //use parkingID to find necessary data
  //Returns a promise so .then is used with takes a function
  var promise = new Promise((resolve, rejects) => {
    Location.findById(parkingID, 'distance centerX centerY numOfParkingUsed totalParkingCapacity').then(results => {
      resolve(results);
    });
  });

  
  //After we get the promise results
  promise.then(promiseReturned =>{
   
    //Distance of user to the center
    const userDistance = calculateDistance(location.userLatitude, location.userLongitude, promiseReturned.centerX, promiseReturned.centerY);
    
    numOfParkingUsed = promiseReturned.numOfParkingUsed;

    if(userDistance<=promiseReturned.distance){
      //If success condition
      if(numOfParkingUsed<promiseReturned.totalParkingCapacity){
        //Updating database also async function so using promise
        var updatePromise = new Promise((resolve, rejects) => {
          Location.findByIdAndUpdate(parkingID, {numOfParkingUsed: numOfParkingUsed+1}).then(results =>{
            resolve(results);
          });
        });

        //Getting result after query is completely executed
        updatePromise.then(updated =>{
          res.send({
            message: "Success",
            numOfParkingUsed: numOfParkingUsed + 1
          });
        });  
      }
      else{
        res.send({
          message: "Parking Full",
          numOfParkingUsed: numOfParkingUsed
        });
      };
    }
    else{
      //Fail condition
      res.send({
        message: "Move close to a parking zone",
        numOfParkingUsed: numOfParkingUsed
      });
    }
  });
});



//Calculate distance between two points on a sphere
function calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344; //Converting to kilometers
      return dist;
    }
  }


module.exports = app;