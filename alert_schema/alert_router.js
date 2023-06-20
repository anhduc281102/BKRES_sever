const express = require("express")
const MongoClient = require('mongodb').MongoClient
require("dotenv").config()
const url = process.env.MONGO_URL
var alert = require('./alert_schema')
var alert_router = express.Router()


// Function to evaluate water quality
const evaluateWater= (document) => {
  Temp = parseFloat(document.Temp)
  pH = parseFloat(document.pH)
  DO = parseFloat(document.DO)

  // Evaluate water quality based on parameters
  if (Temp > 50 && pH < 7 && DO < 5000 ) {
    return "Poor water quality.";
  } else if (30 > Temp > 25 && 7< pH < 8.5 && 5000< DO < 6000) {
    return "Good water quality.";
  } else {
    return "Moderate water quality.";
  }
}

const warning_level= (document) => {
  Temp = parseFloat(document.Temp)
  pH = parseFloat(document.pH)
  DO = parseFloat(document.DO)

  // Evaluate water quality based on parameters
  if (Temp > 50 && pH < 7 && DO < 5000 ) {
    return "2";
  } else if (30 > Temp > 25 && 7< pH < 8.5 && 5000< DO < 6000) {
    return "0";
  } else {
    return "1";
  }
}

alert_router.post('/evaluate',async (req,res)=>{
  console.log(req)
  const client = await MongoClient
    .connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); })
  const database = client.db("devices")
  const collection = database.collection("BKRES_sensor")
  const data = await collection.find({}).toArray()

    // Update the evaluation result back to the database
    for(document of data) {
    quality = evaluateWater(document)
    warning = warning_level(document)    
    collection.updateOne(
    { _id: document._id },
    { $set: { warning_level: warning, evaluation: quality } },
    function(err, result) {
      if (err) {
        console.error('Error updating evaluation result:', err);
      } else {
        console.log('Evaluation result updated successfully.');
      }
      client.close();
    }
  );
  }})

module.exports = alert_router