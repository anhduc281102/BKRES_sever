const mongose = require("mongoose");
var alert_schema = new mongose.Schema({
    device_id:{
        type: String,
        require: true
    },
    ip_device:{
        type: String,
        require: true
    },
    warning_level:{ //0: good, 1: moderate, 2: poor
        type: String,
        require: true
    },
    evaluation:{
        type: String,
        require: true
    },
})

module.exports = mongose.model('alert',alert_schema)