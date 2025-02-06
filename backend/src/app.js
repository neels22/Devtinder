
const express = require("express");
const app = express(); // instance of an express 
const connectDB = require("./config/database")

const User= require("./models/user")
/// creating a post api to add data to database

app.post("/signup",async(req,res)=>{

    const userObj = {
        firstName:"neel",
        lastName:"sarode",
        email:"neel@gmail.com",
        password:"123"
    }
    // how to save it in out database
    // by creating a new instance of the user model
    const user= new User(userObj)  /// this is like creating new instance of userModel
    await user.save()
    res.send("user saved successfully")
})







connectDB()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected:", err);
    });
