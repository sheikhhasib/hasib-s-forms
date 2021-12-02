const mongoose = require('mongoose');

const formsSchema = mongoose.Schema({
    'token' : { 
        type : String
    },
    'title' : { 
        type : String
    },
    'details' : {
        type : String
    },
    'status' : {
        type : String
    },
    'createdBy' : {
        type : String
    },
    'sessionToken' : {
        type : String
    }
},{
    timestamps : true,
})


module.exports = mongoose.model('Forms', formsSchema);
