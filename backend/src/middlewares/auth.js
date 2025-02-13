
const jwt = require("jsonwebtoken")

const User = require("../models/user")

const userAuth = async(req,res,next)=>{


    // read the token from the req cookies 
    // validate the token
    // find the user

    try {
        
        const {token} = req.cookies;
        if (!token) {
            throw new Error("token is not valid")
        }

        const decodedToken = await jwt.verify(token,"Devtinder@123");
    
        const {_id} = decodedToken;
    
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found")
        }

        // attach the user to req object
        req.user = user
    
        next();    



    } catch (error) {

        res.status(400).send("Error: "+error.message);
        
    }
}

module.exports={
    userAuth,
}