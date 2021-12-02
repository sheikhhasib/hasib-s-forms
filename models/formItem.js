const mongoose = require('mongoose');

const formItemSchema = mongoose.Schema({
    'token' : { 
        type : String
    },
    'formToken' : { 
        type : String
    },
    'stepToken' : { 
        type : String
    },
    'image' : { 
        type : String
    },
    'title' : { 
        type : String
    },
    'inputType' : { 
        type : String
    },
    'required' : { 
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


module.exports = mongoose.model('FormItem', formItemSchema);
