const mongoose = require('mongoose');

const itemOptionSchema = mongoose.Schema({
    'token' : { 
        type : String
    },
    'formToken' : { 
        type : String
    },
    'stepToken' : { 
        type : String
    },
    'itemToken' : { 
        type : String
    },
    'itemType' : { 
        type : String
    }, 
    'title' : { 
        type : String
    }, 
    'titleType' : { 
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
    },
    'existence' : {
        type : Number
    }
},{
    timestamps : true,
})


module.exports = mongoose.model('ItemOption', itemOptionSchema);
