const express = require("express")
const MongoClient = require('mongodb').MongoClient
require("dotenv").config()
const url = process.env.MONGO_URL
var device_router = express.Router()
var {makeid} = require('../generate_apiKey')
var Device = require('./device_schema')

device_router.post('/create',async (req,res)=>{
    console.log(req)
    // jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET,async(err,data)=>{
        // Device.findOne({device_id: Device},async (err,device)=>{
            // var findNameDevice = await Device.device_id.findOne(() => device.device_id === req.body.name )
            // if(findNameDevice) return res.json({status:'err', mess:"Name is match"})
            var Api = makeid(8)
            const device_id= req.query.API;
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
       

    // })
// })


device_router.get('/get/allsensors', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("admin")
    const collection = database.collection("devices")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

device_router.get('/get/okoTOJlX', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("devices")
    const collection = database.collection("BKRES_sensor")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

device_router.get('/get/BKRES_test', async (req, res) => {

    const client = await MongoClient
        .connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); })
    const database = client.db("devices")
    const collection = database.collection("BKRES_test")
    const data = await collection.find({}).toArray()
    // console.log(data)
    client.close()

    res.send({ data: data })
})

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