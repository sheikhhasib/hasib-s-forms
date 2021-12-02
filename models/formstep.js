const mongoose = require('mongoose');

const formStepSchema = mongoose.Schema({
    'token' : { 
        type : String
    },
    'formToken' : { 
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
    'previousStepToken' : {
        type : String
    },
    'nextStepToken' : {
        type : String
    },
    'createdBy' : {
        type : String
    },
    'existence' : {
        type : Number
    }
},{
    timestamps : true,
})


module.exports = mongoose.model('FormStep', formStepSchema);
