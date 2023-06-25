const mongose = require("mongoose")
var device_schema = new mongose.Schema({
    device_name:{
        type: String,
        require: true
    },
    device_ip:{
        type: String,
        require: true
    },
    API:{
        type:String,
        required: true
    },
    count_message:{
        type: Number,
        require: true,
        default: 0
    },
    mess_in_minute:{
        type: Number,
        require: false,
        default: 0
    },
    is_block:{
        type: Boolean,
        require: false,
        default: false
    },
    time_interval:{
        type: Number,
        require: false
    },
    lat:{
        type: String,
        require: true
    },
    lon:{
        type: String,
        require: true
    },
    last_message:{   // time that the nearest messagse be receive  
        type: String,
        require: true
    },
    message:[{
        message: String ,
        time: String,
    }]
})
module.exports = mongose.model('device',device_schema)