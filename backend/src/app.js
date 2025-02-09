
const express = require("express");
const app = express(); // instance of an express 
const connectDB = require("./config/database")

const User= require("./models/user")

app.use(express.json()) /// important middleware to handler all json 

// app.delete("/user", (req, res) => {
//     console.log("DELETE /user route reached");
//     console.log("Request body:", req.body);
//     res.send("Received DELETE request");
//   });
  



// Your DELETE route here
app.delete("/user", async (req, res) => {
    const { userID } = req.body;
    
    if (!userID) {
      console.log("No userID provided in the request body.");
      return res.status(400).send("User ID is required");
    }
    
    console.log(`Attempting to delete user with ID: ${userID}`);
    
    try {
      const deletedUser = await User.findByIdAndDelete(userID);
      if (!deletedUser) {
        console.log("User not found.");
        return res.status(404).send("User not found");
      }
      
      console.log("User deleted successfully.");
      res.send("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Something went wrong");
    }
  });

app.put('/user', async (req, res) => {
    const { userID, firstName } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            { firstName },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.send(updatedUser);
    } catch (error) {
        res.status(400).send('Something went wrong');
    }
});


app.get("/signup",(req,res)=>{

    res.send("succesfull")
})


/// creating a post api to add data to database
app.post("/signup",async(req,res)=>{

    console.log(req.body)
    const userObj = req.body

    // how to save it in out database
    // by creating a new instance of the user model
    const user= new User(userObj)  /// this is like creating new instance of userModel

    try {
        await user.save()
        res.send("user saved successfully")
        
    } catch (error) {
        res.status(400).send("Error saving the user:" +err.message)
        
    }

})

app.get("/User",async(req,res)=>{
    const email = req.body.emailId
    try {
         const users=await User.findOne({emailId:email});
         if (!users) {
            res.status(404).send("users not found")
         }
         else{
            res.send(users)
         }
     
    } catch (error) {
        res.status(400).send("something went wrong")   
    }
})

app.get("/feed",async(req,res)=>{
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).send("something went wrong")      
    }
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
