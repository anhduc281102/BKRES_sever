const express = require("express")
var Devices = require('../device_schema/device_schema') // connect to device document 
var message_router = express.Router()
const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGO_URL
var {getDay} = require('./day')

var Message = require('./message_schema')


message_router.get('/update',async(req,res)=>{     // get API 
    const device_name= req.query.API;
    const message_device = req.query.mess;
    const device_ip = req.socket.remoteAddress;
    const device_lat = req.query.lat;
    const device_lon= req.query.lon;

    var isNewdevice = false
    var count = 0
    await Devices.findOne({device_id:device_id},async (err,data)=>{
        console.log(err)
        console.log(data)
        if(err){
            res.json({
                status:"Error",
                message:"Error on server"
            })
        }
        if(data === null){ // can't find device => create new anonymos device and watch 
            console.log('New_device')
            isNewdevice = true
            let new_device = new Devices({
                device_name:device_name,
                ip_device:device_ip,
                count_message:1,
                mess_in_minute:0,
                is_block: false,
                time_interval: 0,
                lat: device_lat,
                lon: device_lon,
                last_message:getDay(),
                message:[{
                    message:message_device,
                    time:getDay()
                }]
            })
            new_device.save((err)=>{
                if(err) res.json({
                    status: 'Error in save new device',
                    mess:'err is '+ err
                })
            })
            // save new device in device doc
        }
        else{// find and save 
            console.log("not a new device")
            isNewdevice = false 
            count = data.count_message
            await data.updateOne({$set:{count_message:count+1 }})
            await data.updateOne({$set:{last_message:getDay()}})
            await data.updateOne({$push:{message:{
                message: message_device,
                time: getDay()
           
        }}})
        }
        var new_mess = new Message({
            device_name: device_name,
            ip_device: req.socket.remoteAddress,
            time: getDay(),
            message: message_device,
            isProcess: false
        })
        await new_mess.save((err)=>{
            if(err) res.json({
                status: "Error in save new message",
                mess:"Error is"+err
            })
            else{
                res.json({
                    status:"Success",
                    mess:isNewdevice?1:count
                })
            }
        })
        // save message in message doc 
        
    })
    
})

message_router.get('/data',async () => {

    const checkdata = (ele) => {
        // new check after translation
        if (isNaN(ele) || ele === "")
            return false
    
        try {
            const t = parseFloat(ele.replace("\n", ""))
            return true
        } catch (err) {
            return false
        }
    }
    
    const getdata = (data) => {
    
        const mes = data.message
        const results = []
        for (m of mes) {
            if (typeof m["message"] === 'undefined')
                continue
            // 2023|06|07|06|50|16|28.77|9.65|774.38|42.34
            let m_data = m.message
                .split("|")
                .filter(checkdata)
                .map(ele => ele.replace("\n", ""));
    
            // console.log(m_data)
            if (m_data.length < 10)
                continue
            // console.log(m_data) 
            // let m_time = m.time
            results.push({
                Date: m_data[0] + '/' + m_data[1] + '/' +m_data[2],
                Time:m_data[3]+ ':' +m_data[4]+ ':' +m_data[5],   
                Temp: m_data[6],
                pH: m_data[7],
                DO: m_data[8],
                EC: m_data[9],
                // time_to_sever: m_time
            })
        }
        return results
    }

        const client = await MongoClient
            .connect(url, { useNewUrlParser: true })
            .catch(err => { console.log(err); })

        if (!client)
            return

        try {
            const database = client.db("admin")
            const collection = database.collection('devices')
            const data = await collection.findOne({ "device_id": "BKRES_sensor" })
            const i = getdata(data)

            const database2 = client.db("devices")
            const collection2 = database2.collection('BKRES_sensor')
            const res = await collection2.insertMany(i);
            console.log("done")
        } catch (err) {
            console.log(err)
        } finally {
            client.close()
        }
})    


module.exports = message_router