const express = require("express")
const MongoClient = require('mongodb').MongoClient
require("dotenv").config()
const url = process.env.MONGO_URL
var device_router = express.Router()
var {makeid} = require('../generate_apiKey')
var Device = require('./device_schema')

const findAndDisplayAttribute = async (dbName, collectionName, attributeName,n) => {
    const client = await MongoClient
      .connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); })
    if (!client)
        return
    try {
      // Select the MongoDB database and collection
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Find the document and retrieve the attribute
      const document = await collection.findOne({});
      const attributeValue = document[attributeName];
      const startIndex = Math.max(0, attributeValue.length - n);
      // Construct the response with the attribute value
      let response = `Attribute: ${attributeName}\n`;
      for (let i = startIndex; i < attributeValue.length; i++) {
        const obj = attributeValue[i];
        response += `Object ${i + 1}:\n`;
        Object.entries(obj).forEach(([key, value]) => {
          response += `${key}: ${value}\n`;
        });
        response += '---\n';
      }

      return response;
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  };

  const findAndDisplayAttributes = async (dbName, collectionName, excludedAttribute) => {
    const client = await MongoClient
      .connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); })
    if (!client)
        return
    try {
  
      // Select the MongoDB database and collection
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Find all documents in the collection
      const documents = await collection.find().toArray();
  
      // Display attributes of each document
      const responseData = documents.map(document => {
        const attributes = Object.keys(document).filter(attribute => attribute !== excludedAttribute);
        return attributes.reduce((obj, attribute) => {
          obj[attribute] = document[attribute];
          return obj;
        }, {});
      });
  
      return responseData;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  };

device_router.post('/create',async (req,res)=>{
    console.log(req)
    /// jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET,async(err,data)=>{
    //     User.findOne({email:data.email},async (err,user)=>{
    //         var findNameDevice = await user.devices.find(device => device.device_name === req.body.name )
    //         if(findNameDevice) return res.json({status:'err', mess:"Name is match"})
            var Api = makeid(8)
            const device_id= req.query.id;
            const device_ip = req.socket.remoteAddress;
            const device_lat = req.query.lat;
            const device_lon= req.query.lon;
            var device = new Device({
                device_id: device_id ,
                device_id: device_ip,
                API :Api ,
                lat: device_lat,
                lon: device_lon,
        
            })
            
            device.save((err)=>{
                if(err) res.json({
                    status:'err',
                    mess:"error is "+ err
                })
                else res.json({
                            status:"success",
                            mess: Api 
                        })
                })
            // var push = await user.devices.push(device)
            // if(push) user.save((err)=>{
            //     if(err) res.json({
            //         status:'err'
            //     })
            //     else res.json({
            //         status:"success",
            //         mess: Api 
            //     })
            // })
            })
//     })
// })

device_router.get('/get/allsensors', async (req, res) => {

    const dbName = 'admin';
  const collectionName = 'devices';
  const excludedAttribute = 'message';

  const attributes = await findAndDisplayAttributes(dbName, collectionName, excludedAttribute);

  res.send(attributes)
})

device_router.get('/get/okoTOJlX/:n', async (req, res) => {
    const n = parseInt(req.params.n);
    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("devices")
    const collection = database.collection("BKRES_sensor")   
    const data = await collection.find({}).sort({ _id: -1 }).limit(n).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

device_router.get('/get/bkres_sensors', async (req, res) => {
    const dbName = 'devices';
    const collectionName = 'bkres_sensors';
    const attributeName = req.query.attributeName;
    const n = parseInt(req.query.n);

  if (!attributeName || !n || isNaN(n)) {
    return res.status(400).send('Invalid parameters');
  }

  const response = await findAndDisplayAttribute(dbName, collectionName, attributeName, n);
  res.send(response);
});
    
device_router.get('/data/idsensor', async (req, res) => {
    const id = req.query.id
    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("admin")
    const collection = database.collection("devices")
    const data = await collection.findOne({ "device_id": id })
    console.log(id)
    client.close()

    res.send({ data: data })
})

module.exports = device_router