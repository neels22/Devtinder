const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

// Middleware
app.use(express.json());
app.use(cookieParser());


// FEED (Protected Route)
app.get("/feed", userAuth, async (req, res) => {
  try {
    if (!req.cookies) throw new Error("Invalid cookie");
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});


// Connect to Database and Start Server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => console.error("Database cannot be connected:", err));
