const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const Location = require('./models/location');

const { basename } = require('path/posix');

//create server
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


//Return markers
app.get("/", (req, res, next) => {
 Location.find().then(results => {
    res.send({
        data: results
    });
  });  
});


app.post("/verifyLocation/:location", (req, res, next) => {
    
  ////////////////////////////////  
    const data = new Location({
      name: 'Activity center',
      radius: 0.0381,
      centerX: 32.529943098278494,           
      centerY: -92.068317855001371,
      numOfParkingUsed: 0,
      totalParkingCapacity: 20  
    });

    //compare location to database to say u can park
    res.send({
        a: "apple",
        b: "ball"
    });
});

 //testing
 app.get("/verifyLocation", (req, res, next) => {
  res.status(200).json({
      message: 'Post added successfully'
  });
});

//Calculate distance
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