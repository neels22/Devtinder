
const express = require("express");
const authRouter = express.Router();
const validateSignUpData = require("../utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid email ID");

    const user = await User.findOne({ emailId });
    if (!user || !user.validatePassword(password))
      throw new Error("Invalid credentials");

    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("User login successful");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout",async (req,res) => {
    
    res.cookie("token",null,{
        expires:new Date(Date.now()), 
    });


    res.send("logout successfull");



})


module.exports = authRouter;
