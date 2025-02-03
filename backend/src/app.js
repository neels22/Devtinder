
const express = require("express");
const app = express(); // instance of an express 


app.get("/user",(req,res)=>{

    res.send({
        name:"neel",
        lastname:"sarode"
    })
})

app.post("/user",(req,res)=>{
    
    res.send("data stored successfully")
})

app.delete("/user",(req,res)=>{
    
    res.send("data deleted")
})

app.use("/user",(req,res)=>{
    
    res.send("this is from app.use")
})


app.listen(3000,()=>{
    console.log("server listening on port 3000")
})
