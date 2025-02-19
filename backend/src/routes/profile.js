const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const app = express();

const { userAuth } = require("../middlewares/auth");

const {validateEditProfile} = require("../utils/validation")

// Middleware
app.use(express.json());
app.use(cookieParser());

profileRouter.get("/profile",userAuth, async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});


profileRouter.patch("/profile/edit",userAuth,async (req,res) => {

    try {
        
        if(!validateEditProfile(req)){
            throw new Error("invalid edit request")
        }


        const loggedinuser = req.user 

        Object.keys(req.body).forEach((key)=>{
            loggedinuser[key] = req.body[key]
        });

        loggedinuser.save()


        res.send("edit was successfull")

    } catch (error) {

        res.status(400).send("ERROR: "+error.message);
        
    }
    


})




module.exports = profileRouter;
