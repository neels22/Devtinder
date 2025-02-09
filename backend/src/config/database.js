
// logic to connect to our database
// mongoose library used to connect to our database

const mongoose =require("mongoose")

// the below gives a promise 
const connectDB = async (  ) => {
    
mongoose.connect("mongodb://localhost:27017/")
}

module.exports= connectDB

