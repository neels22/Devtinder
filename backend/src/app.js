const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

// Middleware
app.use(express.json());
app.use(cookieParser());

// DELETE user
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

// UPDATE user
app.put("/user", async (req, res) => {
  const { userID, ...data } = req.body;
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  try {
    const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));
    if (!isUpdateAllowed) throw new Error("Update not allowed");
    if (data?.skills?.length > 10) throw new Error("Skills cannot be more than 10");

    const updatedUser = await User.findByIdAndUpdate(userID, data, { new: true });
    if (!updatedUser) return res.status(404).send("User not found");

    res.send(updatedUser);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// SIGNUP
app.get("/signup", (req, res) => res.send("Successful"));

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, password: passwordHash, emailId });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) throw new Error("Invalid email ID");

    const user = await User.findOne({ emailId });
    if (!user || !user.validatePassword(password)) throw new Error("Invalid credentials");

    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("User login successful");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// GET USER
app.get("/User", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

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

// PROFILE (Protected Route)
app.get("/profile", userAuth, (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Something went wrong: " + error.message);
  }
});

// SEND CONNECTION REQUEST (Protected Route)
app.post("/sendconnrequest", userAuth, (req, res) => {
  console.log(`${req.user.firstName} sent the connection request`);
  res.send("Connection request sent by: " + req.user.firstName);
});

// Connect to Database and Start Server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => console.log("Server listening on port 3000"));
  })
  .catch((err) => console.error("Database cannot be connected:", err));
