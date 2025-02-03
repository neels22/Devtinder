
const express = require("express");
const app = express(); // instance of an express 

app.use("/hello",(req,res)=>{
    res.send("this is from difere ")
})

app.use((req,res) => {

    res.send("heello from the server")
})



app.listen(3000,()=>{
    console.log("server listening on port 3000")
})
