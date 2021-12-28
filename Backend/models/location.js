//Command to connect to mongodb atlas using mongo shell ./mongosh "mongodb+srv://cluster0.9tttj.mongodb.net/custerName" --username admin
//importing mongoose
const { Decipher } = require('crypto');
const mongoose = require('mongoose');


//Building schema
const location = mongoose.Schema({
    name: {type: String},
    distance: {type: mongoose.Types.Decimal128},
    centerX: {type: mongoose.Types.Decimal128},
    centerY: {type: mongoose.Types.Decimal128},
    numOfParkingUsed: {type: Number},
    totalParkingCapacity: {type: Number}

});

module.exports = mongoose.model('Location', location);