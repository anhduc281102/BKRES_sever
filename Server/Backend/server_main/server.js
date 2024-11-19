require('dotenv').config();
var express = require("express")
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
var userouter = require('./router/userRoute')
var gatewayrouter= require('./router/gateway_router')
var devicerouter = require('./router/device_route')
var sensorrouter = require('./router/sensor_router')
var datarouter= require('./router/data_router')
var app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var mongodb_url = "mongodb://bkres:bkres@mongo-db:27017?retryWrites=true&w=majority"

mongoose.Promise = global.Promise

///////////////////////////////////////////////////////////////
// Lấy chuỗi kết nối từ biến môi trường
const connectionString = process.env.MONGO_DB_CONNECTION_STRING;
const cors = require('cors')
//// In ra màn hình
// console.log("[+++++] MongoDB Connection String:", connectionString);
///////////////////////////////////////////////////////////////

mongoose.connect(connectionString).then(
    ()=>{
        console.log('[+] Connect MongoDB successfully!')
        app.listen(5000,()=>{
            console.log('[+] App listen on port 5000')
            console.log("[+] Server is running!\n[+] API documentation: http://localhost:5000/swagger/doc")
        })
        ,err=>{
            console.log(err)
        }
    }
)
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/user',userouter)
app.use('/api/device',devicerouter)
app.use("/api/gateway",gatewayrouter)
app.use("/api/data",datarouter)
app.use("/api/sensor",sensorrouter)

app.use('/swagger/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


