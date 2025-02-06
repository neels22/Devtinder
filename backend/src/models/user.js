

const mongoose = require("mongoose")

const userSchema  = new mongoose.Schema({
    // this is where you create the actual schema
    // variable naming -- camel casing
    firstName: {
        type:String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }


});

/// now we create a mongoose model
// you pass the NAME of the model and the SCHEMA of the model
const User = mongoose.model("User",userSchema)

module.exports = User